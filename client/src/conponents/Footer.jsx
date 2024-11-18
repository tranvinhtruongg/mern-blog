import { Footer } from "flowbite-react"
import { Link } from "react-router-dom"
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';
export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
        <div className="w-full max-w-7xl mx-auto">
            <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                <div className="mt-5">
                    <Link to="/" className="self-center whitespace-nowrap text-lg 
                        sm:text-xl font-semibold dark:text-white">
                    <span className="px-2 py-1 bg-gradient-to-r from-lime-500
            via-sky-500 to-red-500 rounded-lg text-white">TVT Blog</span>
                    </Link>
                </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                    <div>
                        <Footer.Title title="ABOUT"/>
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href="https://www.fb.com/truongdzzz"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                TVT
                            </Footer.Link>
                            <Footer.Link
                                href="/about"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                TVT Blog
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title="FOLLOW US"/>
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href="https://github.com/tranvinhtruongg"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Github
                            </Footer.Link>
                            <Footer.Link
                                href="https://discord.gg/3K6mE35k"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Discord
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title="Legal"/>
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href="#"
                            >
                                Terms &amp; rules
                            </Footer.Link>
                            <Footer.Link
                                href="#"
                            >
                                Privacy policy
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider/>
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright
                href='#'
                by="TVT blog"
                year={new Date().getFullYear()}
                />
                <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                    <Footer.Icon href='https://www.facebook.com/truongdzzz' icon={BsFacebook}/>
                    <Footer.Icon href='https://www.instagram.com/tranvinhtruongg/' icon={BsInstagram}/>
                    <Footer.Icon href='#' icon={BsTwitter}/>
                    <Footer.Icon href='https://github.com/tranvinhtruongg' icon={BsGithub}/>
                    <Footer.Icon href='#' icon={BsDribbble}/>

                </div>
            </div>
        </div>
    </Footer>
  )
}
