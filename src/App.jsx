import { useState, useRef, useEffect } from 'react'
import { memo } from 'react'
import qrcode from 'qrcode'
import qrcodeimg from './assets/qr-code.png'
import passimg from './assets/key.png'


function App() {
    const urlvalue = useRef()
    const password = useRef()
    const [qr, setqr] = useState('')
    const [protect, setprotect] = useState(false)
    const [shortenurl, setshorten] = useState("")
    useEffect(() => {
        console.log("Component mounted")
    }, []);

    const [boxes, setboxes] = useState([{ id: 1, img: qrcodeimg, isactive: false }, { id: 2, img: passimg, isactive: false }])

    const validurl = (url) => {
        try {
            new URL(url)
            return true
        } catch (err) {
            return false
        }
    }
    const generateQR = async (url) => {
        if (!url || !validurl(url)) {
            console.log('cant generate qr')
            return
        }
        try {
            const genQR = await qrcode.toDataURL(url, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#1f2937',
                    light: '#ffffff',
                }
            })
            setqr(genQR)
        } catch (error) {
            console.log('error occured while generating qr', error)
        }


    }

    const activebox = boxes.filter((e) => e.isactive)

    async function fetchdata(url, pass) {
        if (!url || !validurl(url)) {
            console.log("invalid url, skipping fetch.");
            return;
        }

        if (activebox.length > 0) {
            if (activebox[0].id === 1) {
                generateQR(url)
                return;
            }
            if (activebox[0].id === 2) {
                setprotect(true)
                fetchprotected(url, pass)
                return
            }

        }

        const response = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { URL: url }
            )
        })
        const data = await response.json()
        setshorten(data.shorturl)
        console.log('fetch req sent!')
        urlvalue.current.value = ""
        setprotect(false)
    }

    const fetchprotected = async (url, pass) => {
        if (!pass) {
            console.log('enter a password')
            return
        }
        const response = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ URL: url, isprotected: true, password: pass })
        })
        if (response.status === 201) {
            const data = await response.json()
            setshorten(data.shorturl)
            console.log('fetch req sent protected!')
            urlvalue.current.value = ""
            setprotect(false)
        }else if(response.status===403){
            const data = await response.json()
            window.location.href=data.redirect
        }

    }

    const handlecopy = (URL) => {
        navigator.clipboard.writeText(URL)
    }

    const handleactive = (id) => {
        setboxes((prev) => {
            return prev.map(box => {
                if (box.id === id) {
                    return { ...box, isactive: !box.isactive };
                }
                return { ...box, isactive: false };
            })
        })
    }

    return (
        <section className='min-h-screen bg-gray-900 flex justify-center items-center p-5'>
            <div className='container bg-gray-800 border-2 border-gray-600 rounded-2xl p-5 w-fit flex flex-col items-center gap-10'>
                <div className='flex justify-center gap-5 flex-wrap w-full'>
                    <input ref={urlvalue} className=' bg-gray-800 text-white  p-3 w-70 rounded-2xl focus:outline-0 font-mono border-2 border-gray-500' type="text" placeholder='URL' />
                    <button onClick={() => { fetchdata(urlvalue.current.value) }} className='bg-gray-900 p-2 text-white rounded-2xl cursor-pointer font-mono w-40 hover:scale-101'>shorten now</button>
                </div>

                <div className='flex w-full gap-5'>

                    {
                        boxes.map((box) => {

                            return (
                                <div onClick={() => { handleactive(box.id) }} key={box.id} className={`w-15 p-3 h-15 ${box.isactive ? 'bg-gray-900' : 'bg-gray-600'} border-2 border-gray-500 rounded-2xl cursor-pointer hover:scale-101 hover:bg-gray-900`}>
                                    <img className='w-full h-full invert' src={box.img} alt="" />
                                </div>
                            )
                        })
                    }


                </div>
                {qr != '' && <div className='justify-center flex bg-white'>
                    <a href={qr} download={qr}>
                        <img onClick={(e) => { e.target.remove() }} src={qr} alt="QR Code" />
                    </a>
                </div>
                }


                {protect && activebox.length > 0 && <div className='justify-center flex flex-wrap rounded-2xl gap-5'>
                    <input ref={password} type="password" className='w-50 p-3 rounded-2xl font-mono focus:outline-0 bg-gray-900 text-white' placeholder='enter a password' />
                    <button onClick={() => { fetchdata(urlvalue.current.value, password.current.value) }} className='p-3 bg-gray-500 font-mono rounded-2xl text-white cursor-pointer hover:scale-101'>create</button>
                </div>
                }

                <div className='w-70 rounded-2xl justify-center flex flex-wrap gap-5'>
                    {shortenurl && (
                        <>
                            <div className='p-4 w-full rounded-2xl bg-gray-900 border-2 border-gray-500 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800 h-15 text-white'>http://localhost:3000/api/{shortenurl}</div>
                            <button onClick={() => {
                                handlecopy(`http://localhost:3000/api/${shortenurl}`)
                                setshorten('')
                            }} className='bg-blue-700 p-4 font-bold border-2 w-full text-blue-100 rounded-2xl border-blue-400 cursor-pointer hover:scale-101 font-mono'>Copy Link</button>
                        </>
                    )}
                </div>
            </div>

        </section>
    )
}

export default App