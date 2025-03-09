import React, {useState, useContext, useEffect} from 'react';
import coverImg from "./images/cover_not_found.jpg"; // Import the fallback image

const AppContext = React.createContext();
const URL = "https://www.googleapis.com/books/v1/volumes?q=";

const AppProvider = ({children}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultTitle, setResultTitle] = useState("");

    useEffect(() => {
        const fetchBooks = async () => {
            if (!searchTerm) return;
            
            setLoading(true);
            try {
                const response = await fetch(`${URL}${searchTerm}`);
                const data = await response.json();
                
                if (data.items) {
                    const newBooks = data.items.map((item) => {
                        const { volumeInfo } = item;
                        return {
                            id: item.id,
                            title: volumeInfo.title || "No Title",
                            author: volumeInfo.authors ? volumeInfo.authors.join(", ") : "No author listed",
                            cover_img: volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || '/images/cover_not_found.jpg',
                            published: volumeInfo.publishedDate || "N/A",
                            description: volumeInfo.description || "No description available",
                            rating: volumeInfo.averageRating || 0,
                            ratingsCount: volumeInfo.ratingsCount || 0
                        };
                    });

                    setBooks(newBooks);
                    setResultTitle(`Search results for "${searchTerm}"`);
                } else {
                    setBooks([]);
                    setResultTitle("No Books Found!");
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                setBooks([]);
                setResultTitle("Error fetching books. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        // Add debounce to prevent too many API calls
        const timeoutId = setTimeout(() => {
            fetchBooks();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <AppContext.Provider value = {{
            loading, 
            books, 
            setSearchTerm, 
            resultTitle, 
            setResultTitle,
        }}>
            {children}
        </AppContext.Provider>
    )
}

const useGlobalContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within an AppProvider');
    }
    return context;
}

export {AppContext, AppProvider, useGlobalContext};