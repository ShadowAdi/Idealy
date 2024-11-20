import React from 'react'

const DashboardLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex flex-col py-4 items-start justify-start mt-6 min-h-[88vh] w-full '>{children}</div>
  )
}

export default DashboardLayout