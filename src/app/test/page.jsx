import EditLinks from '../../components/component/Editlinks'
import EditProfile from '../../components/component/EditProfile'
import React from 'react'

const page = () => {
  return (
    <>
   <EditLinks user={mockUser} />
    {/* <EditProfile user={mockUser}/> */}
    </>
  )
}

export default page
const mockUser = {
  _id: '12345',
  username: 'john_doe', // example username
  email: 'john.doe@example.com', // example email
  bio: 'Software Developer passionate about building dynamic web applications.', // example bio
  profilePicture: 'https://www.example.com/profile.jpg', // example profile picture URL
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
  socialMediaHandles: {
    facebook: 'https://facebook.com/john_doe',
    github: 'https://github.com/john_doe',
    linkedin: 'https://linkedin.com/in/john_doe',
    instagram: 'https://instagram.com/john_doe',
    twitter: 'https://twitter.com/john_doe',
    youtube: 'https://youtube.com/c/john_doe',
  }
};
