import Link from "next/link";
import React from "react";


// const setNavLinks: Array<{ text: string, url: string}> = [
//     { text: "これまでつくったもの", url: "/portfolio"},

// ];

const Header = () => {
    return (
       <>
            <header className="flex flex-col top-0 left-0 right-0 z-50  shadow-sm">
                <div className="flex items-center px-4 min-h-[56px] sm:min-h-[74px] sm:px-6">
                    <div className="mx-auto w-full  sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-headerlg">
                        <div className="flex justify-center">
                         
                                <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <h1>
                                        <img src="/aoblogtitle.svg" alt="ブログタイトル"/>
                                    </h1>
                                </Link>
                         
                           
                              
                          
                                {/* <nav>
                                    
                                    <ul className=" inline-flex gap-4  list-none m-0 p-0 py-2 relative">
                                        { setNavLinks.map( (navLink) => (
                                        <button key={navLink.text}  className=" cursor-pointer inline-flex tracking-[0.1em] items-center justify-center min-w-[64px] rounded  px-4 py-2 font-bold uppercase   transition-all duration-250 ease-in-out hover:text-(--color-secondary-main) hover:bg-(--color-divider-main)">
                                                {navLink.text}
                                        </button>

                                        ))}
                                    </ul>
                                </nav> */}
                                
                         
                        </div>
                    </div>
                </div>
            </header>
       </>
    );
}

export default Header;