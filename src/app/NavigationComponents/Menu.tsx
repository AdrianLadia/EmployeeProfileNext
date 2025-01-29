
import React, { FC } from 'react';

import Link from 'next/link';
 
import { CardsSchema, CardSchema } from '../Schema';

interface MenuButtonProps {
  open: boolean; 
  cards: CardsSchema;
  pathname: string;
  setOpen: (open: boolean) => void;
} 

const Menu: FC<MenuButtonProps> = ({ open, cards, pathname, setOpen }) => { 

  return (
    <div 
      className={` ${!open? " opacity-0 bottom-20 scale-0 invisible" : "scale-100"}  transition-all duration-200 ease-in
        fixed bottom-32 gap-4 origin-bottom z-[999]
        flex flex-wrap justify-center item-center 
        w-[90vw] md:w-[60vw] lg:w-[40vw] xl:w-[30vw] 2xl:w-[25vw] 
      `}
    >
      {Object.keys(cards).map((key : string) => {
        return (
          cards[key].map((card: CardSchema, index: number) =>  {
            const isActive = pathname.startsWith(card.path)
            return (
              <div className='h-14 w-14 md:h-16 md:w-16 text-xl ' key={`${key} ${index}`} id={card.id}>
                <Link href={card.path}
                  className={` md:tooltip tooltip-top 
                    ${isActive? 'border-info bg-info text-white ' 
                      : 'border-gray-400 bg-base-100/85 text-gray-400 hover:border-info hover:text-info  '
                    } 
                    w-full h-full border rounded-box shadow-md shadow-gray-400
                    flex items-center justify-center 
                  `} data-tip={card.title}
                  onClick={()=>setOpen(false)}
                >
                  {card.icon}
                </Link>
              </div> 
            )
          })
        )
      })}  
    </div>
  )
}

export default Menu
