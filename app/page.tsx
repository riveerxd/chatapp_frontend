"use client"
import { useEffect} from "react"
import { redirect } from "next/navigation"

export default function Page() {
  useEffect(() =>{
    redirect("/login")
  },[])
  
  return(
    <>
    <p>redirecting...</p>
    </>
  )
}