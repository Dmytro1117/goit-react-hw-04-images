// import React, { Component } from 'react';
import {useState, useEffect} from 'react';
import { fetchImages } from './api/api';
import  Searchbar from './Searchbar/Searchbar';
import { Loader } from './Loader/Loader';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import Modal from './Modal/Modal';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


export const App =()=> {
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState([])
  const [page, setPage] = useState(1)
  const per_page=12
  const [isLoading, setIsLoading] = useState(false)  
  const [loadMore, setLoadMore] = useState(false)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [largeImageURL, setLargeImageURL] = useState('')


  useEffect(() => {
    getImages(searchQuery, page);
  }, [page, searchQuery])

const getImages = async (query, page) => {
    if (!query) {
      return;
    }
   setIsLoading(true);
    try {
      const { hits, totalHits } = await fetchImages(query, page);
      if (hits.length === 0) {
        return  Notify.warning('Images not found');
      }
      setImages((imag) => [...hits, ...imag ])
      setLoadMore(page < Math.ceil(totalHits / per_page))
    }
    catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formSubmit = searchQuery => {
    setSearchQuery(searchQuery)
    setImages([])
    setPage(1)
    setLoadMore(false)
  };

  const onloadMore = () => {
     setIsLoading(true);
    setPage(() => ( page + 1 ));
  };


  const openModal = largeImageURL => {
      setShowModal(true)
      setLargeImageURL(largeImageURL)
  };

 const closeModal = () => {
      setShowModal(false)
  };


  return (
      <>
        <Searchbar onSubmit={formSubmit} />
        
        {isLoading ? (<Loader />) : (<ImageGallery images={images} openModal={openModal} />)}

        {error && <p>error</p>}  
        
        {loadMore && <Button onloadMore={onloadMore} />}

        {showModal && (<Modal largeImageURL={largeImageURL} onClose={closeModal} />)}
      </>
    );
}
