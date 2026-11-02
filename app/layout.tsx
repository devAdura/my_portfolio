import {siteUrl} from "../lib/site-url";
import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL(siteUrl()),title:"Elite Software | Adura Gbemi | Full Stack Developer",description:"Adura Gbemi builds responsive React interfaces and full stack applications with TypeScript and Python. Explore projects and get in touch.",openGraph:{title:"Elite Software | Adura Gbemi",description:"Thoughtful code. Useful products. Built for people.",type:"website",images:["/og.svg"]},icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>;}
