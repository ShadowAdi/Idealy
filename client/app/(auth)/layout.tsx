import React from 'react'

const UserLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex flex-col py-4 items-center justify-center min-h-[88vh] h-full w-full'>{children}</div>
  )
}

export default UserLayout