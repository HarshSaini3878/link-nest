import EditLinks from '../../component/Editlinks.jsx/index.js'
import React from 'react'

const page = () => {
  return (
    
   <EditLinks user={mockUser} />
    
  )
}

export default page
const mockUser = {
  _id: '12345',
  links: [
    {
      title: 'Google',
      url: 'https://www.google.com',
      icon: 'https://www.google.com/favicon.ico',
    },
    {
      title: 'GitHub',
      url: 'https://github.com',
      icon: 'https://github.githubassets.com/favicon.ico',
    },
  ],
};