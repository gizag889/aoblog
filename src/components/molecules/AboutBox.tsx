import React from 'react'
import { CircleQuestionMark } from 'lucide-react';


const AboutBox = () => {
  return (
    <div className='w-70'>
        <div>
            <div className='rounded-t-2xl  border-1 border-(--color-divider-main) '>
                <div className='flex items-center justify-center gap-1'>
                    <CircleQuestionMark size={18} />
                    <div className='text-center py-2'>青柳のブログとは</div>
                </div>
            </div>
            <div  className='flex gap-4 p-4  border-1 border-(--color-divider-main) rounded-b-2xl'>
                <img src="/icon.svg" alt="アイコンの画像"/>
                <div>このブログでは主にweb技術や読書記録などについて載せていきます。</div>
            </div>
        </div>
    </div>
  )
}

export default AboutBox