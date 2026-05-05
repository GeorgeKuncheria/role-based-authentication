'use client'

import { User } from "@/app/types"

interface HeaderProps{
  user : User | null;
}

const Header = ({user}: HeaderProps) => {
    
    return (
      <div>Header</div>
    )
}

export default Header