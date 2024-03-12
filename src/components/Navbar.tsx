"use client";
import React, { useState } from 'react'
import { MdMyLocation, MdOutlineLocationOn  , } from "react-icons/md";
import SearchBox from './SearchBox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '@/app/atom';
type Props = {
  location?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({location}: Props) {

  const [city , setCity] = useState("")
  const [error , setError] = useState("")

  const [suggestions , setSuggestions] = useState<string[]>([])
  const [showSuggestions , setShowSuggestions] = useState(false)
  const [place, setPlace] = useAtom(placeAtom)
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom)

 async function handleInputChange(value : string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`);
        const suggestions = res.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
    else{
      setSuggestions([]);
      setError("City not found");
      setShowSuggestions(false);
    }
  }
  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }
  function handleSubmitChange(e:React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true)
    e.preventDefault();
    if (suggestions.length === 0) {
      setError("City not found");
      setLoadingCity(false)
    }
    else{
      setError("")
      setTimeout(() => {
        setLoadingCity(false)
      setPlace(city);
      setShowSuggestions(false)
      }, 500);
    }
  }
  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (postiion) => {
        const { latitude, longitude } = postiion.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }
  return (
    <>
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-gray-700'>
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl mx-auto">
        <>
        <p className='flex items-center justify-center gap-2'>
          <h2 className='text-white text-3xl '> Weather 🌞</h2>
        </p>
        </>
        <section className='flex gap-2 items-center'>
          <MdMyLocation
          title='Your current location'
          onClick={handleCurrentLocation}
           className='text-gray-400 text-2xl hover:opacity-80 cursor-pointer'/>
          <MdOutlineLocationOn className='text-gray-300 text-3xl ' />
          <p className='text-gray-400 text-sm'>{location}</p>
          <div className='relative hidden md:flex'>{/*SearchBox*/}
            <SearchBox value={city}
            onSubmit={handleSubmitChange}
            onChange={(e) =>{handleInputChange(e.target.value)}}
            />
            <SuggestionBox {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error
            }}/>
          </div>
        </section> 
      </div>
    </nav>
    <section className="flex   max-w-7xl px-3 md:hidden ">
    <div className="relative">
      {/* SearchBox */}
      <SearchBox
        value={city}
        onSubmit={handleSubmitChange}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      <SuggestionBox
        {...{
          showSuggestions,
          suggestions,
          handleSuggestionClick,
          error
        }}
      />
    </div>
  </section>
  </>
  )
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (suggestion: string) => void;
  error: string;
}) {

  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="mb-4 bg-white absolute border top-[64px] right-[148px] border-gray-300 rounded-md min-w-[200px]  flex flex-col gap-1 py-2 px-2">
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1 "> {error}</li>
          )}

          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-1 rounded  hover:bg-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}