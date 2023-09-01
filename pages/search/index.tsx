import React, { useState } from 'react';
import { TfiArrowLeft } from "react-icons/tfi";
import { VscClose } from "react-icons/vsc";

const Search = () => {
    const [tab, setTab] = useState("전체");

    return (
        <div className="absoulte top-0 mx-auto bg-white">
            <div className="flex flex-col p-6">
                <form className="ml-2 flex items-center w-[650px]">
                    <div>
                        <TfiArrowLeft className="w-[24px] h-[24px] mr-1 cursor-pointer"/>
                    </div>
                    <div className='relative border border-gray-100 bg-gray-100 ml-3 px-4 py-2 w-full mr-2'>
                        <input
                            type='text'
                            placeholder='검색어를 입력하세요.'
                            className='w-full bg-transparent'
                        />
                        <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                            <VscClose className="w-[18px] h-[18px] text-gray-600 cursor-pointer" />
                        </div>
                    </div>
                    <button
                        type="submit">
                    </button>
                </form>

                {/*Tab navigation*/}
                <nav className='mt-6 w-full h-[44px] flex justify-around items-center'>
                    {['전체','계정','피드','태그'].map((name) => (
                        <div 
                            key={name}
                            className={`pb-2 text-center w-full ${tab === name ? 'border-b-2 border-black text-gray-900' : 'border-b border-gray-200 text-gray-400'}`}>
                            <button 
                                onClick={() => setTab(name)}
                                className='text-[16px] font-bold'>
                                {name}
                            </button>
                        </div>
                    ))}
                </nav>

                {/* Tab content */}
                {(tab === '전체') && 
                (<section className='overflow-auto'>
                    <div className='flex items-center justify-between h-[60px]'>
                        <p className='mt-4 text-sm text-gray-600'>계정</p>
                        <div className='mt-2 flex items-center justify-end'>
                            <button className='text-sm mr-2 text-gray-400'>더보기</button>
                        </div>
                    </div>
                    <ul className='mt-4 ml-4 pb-2'>
                        <li className='pb-2'>
                            sohyun
                        </li>
                        <li className='pb-2'>
                            eunseok
                        </li>
                        <li className='pb-2'>
                            jongjin
                        </li>
                    </ul>
                </section>)}
                {(tab === '계정') && 
                (<section className='overflow-auto'>

                </section>)}
                {(tab === '피드') && 
                (<section className='overflow-auto'>

                </section>)}
                {(tab === '태그') && 
                (<section className='overflow-auto'>

                </section>)}

                <div className='mt-6 pb-6'>
                    <p className='text-sm text-gray-600'>피드</p>
                    <ul className='mt-4 ml-4 pb-2'>
                        <li className='pb-2'>
                            sohyun
                        </li>
                        <li className='pb-2'>
                            eunseok
                        </li>
                        <li className='pb-2'>
                            jongjin
                        </li>
                    </ul>
                </div>
                <div className='mt-6 pb-6'>
                    <p className='text-sm text-gray-600'>태그</p>
                    <ul className='mt-4 ml-4 pb-2'>
                        <li className='pb-2'>
                            sohyun
                        </li>
                        <li className='pb-2'>
                            eunseok
                        </li>
                        <li className='pb-2'>
                            jongjin
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
};

Search.getLayout = function getNoNavPage(page: React.ReactNode) {
    return (
        <div className="wrap">
            <div className="container">
                {page}
            </div>
        </div>
    );
};

export default Search;