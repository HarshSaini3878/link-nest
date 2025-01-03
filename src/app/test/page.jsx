import EditLinks from '../../components/component/Editlinks'
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
      title: 'portfolio',
      url: 'https://www.google.com',
      icon: 'https://www.google.com/favicon.ico',
    },
    {
      title: 'leetcode',
      url: 'https://github.com',
      icon: 'https://github.githubassets.com/favicon.ico',
    },
  ],
};