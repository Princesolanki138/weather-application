import { cn } from '@/utils/cn';
import React from 'react'
import { IoSearch } from 'react-icons/io5'

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

function SearchBox(props: Props) {
  return (
    <form onSubmit={props.onSubmit} className={cn("flex relative items-center justify-center h-10" , props.className)}>
        <input type="text" value={props.value} onChange={props.onChange} placeholder='Search location..' 
        className='w-[230px] py-2 px-4 border rounded-full border-gray-300 focus:outline-none focus:border-blue-500 h-full'/>
        <button className='px-4 py-[9px] bg-blue-500 text-white rounded-full focus:outline-none hover:bg-blue-600 h-full absolute right-0 '>
        <IoSearch />
        </button>
    </form>
  )
}

export default SearchBox