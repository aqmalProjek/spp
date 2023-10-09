'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  const {data : session, status} = useSession();
  useEffect(() => {
    if(status === 'authenticated') {
      router.push('/dashboard')
    }
  },[status])

  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState('');
  const [loading,setLoading] = useState(false);
  
 
  const submitHandle = async(e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    const data = {
      username,
      password,
      redirect : false
    }

    console.log(data);
    const stats = await signIn('credentials',data);
    if(stats.error) {
      setMessage('Username atau password salah');
    }
    setLoading(false)
  }
  return (
    <>
    <div
      className="d-flex justify-content-center align-items-center position-relative"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage : "url(bg.jpg)",
        backgroundAttachment : "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        zIndex: -1
      }}
    >

      
      
      
    </div>

    <div className="bgLogin position-absolute d-flex justify-content-center align-items-center " style={{
        width: '100% !important',
        height: '100%',
        zIndex: 2,
        top: 0
      }}>
          <div className="border border-2 rounded p-5 bg-white position-absolute" style={{
        zIndex: 10
      }}>
        <div className="position-relative mb-2" style={{
          width: '100%',
          height: '65px'
        }}>

        <Image src={'/logo.png'} alt="...." priority sizes="150" fill/>
        </div>
        <form onSubmit={submitHandle}>
          <p className="text-danger">{message}</p>
          {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="username"
            name="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <label htmlFor="floatingInput">Username</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="d-grid gap-2 mt-3">
          <button className="btn btn-primary" type="submit" >
            Login
          </button>
        </div>
        </form>
      </div>
      </div>
    
    </>
  );
}
