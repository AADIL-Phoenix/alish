import React from 'react';
import { useGlobalContext } from '../../context';
import Book from '../BookList/Book';
import Loading from '../Loader/Loader';
import './BookList.css';

const BookList = () => {
  const { books, loading, resultTitle } = useGlobalContext();

  if(loading) return <Loading />;

  return (
    <section className='booklist'>
      <div className='container'>
        <div className='section-title'>
          <h2>{resultTitle}</h2>
        </div>
        <div className='booklist-content grid'>
          {books.length === 0 ? (
            <div className='no-books'>
              <h3>No books found</h3>
            </div>
          ) : (
            books.map((item) => (
              <Book key={item.id} {...item} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BookList;