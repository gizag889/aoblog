import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import { ReactNode } from "react";
import Toc from "@/components/molecules/toc";

const Layout = ({ children, hidePt = false }: {
    children: ReactNode
    hidePt?: boolean 
}) => {
    return (
        <div> 
            <Header/>
                <div className="flex justify-center">
                    <Toc/>
                    <div className="order-1">{children}</div>
                </div>
            <Footer />
        </div>
    )
}

export default Layout