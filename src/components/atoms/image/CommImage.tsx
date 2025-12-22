// component
import Image from "next/image"

const CommImage = ({ src, alt }: {
    src: string,
    alt: string,
}) => {
    return (
        <div className={`relative w-full h-45  object-cover`}>
            <Image
                src={src}
                alt={alt}
                fill
                className=" rounded-t-lg"
                unoptimized={src.startsWith('/wp-content')}
                 />
        </div>
    )
}

export default CommImage