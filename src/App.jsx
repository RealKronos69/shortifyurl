import { useState, useRef, useEffect } from 'react'
import { memo } from 'react'
import qrcode from 'qrcode'
import qrcodeimg from './assets/qr-code.png'
import passimg from './assets/key.png'


function App() {
    const urlvalue = useRef()
    const [qr,setqr] = useState('')
    const [shortenurl, setshorten] = useState("")
    useEffect(() => {
        console.log("Component mounted")
    }, []);

    const [boxes,setboxes] = useState([{ id: 1, img: qrcodeimg, isactive:false }, { id: 2, img: passimg, isactive:false }])

    const validurl = (url) => {
        try {
            new URL(url)
            return true
        } catch (err) {
            return false
        }
    }


    async function fetchdata(url) {
        if (!url || !validurl(url)) {
            console.log("invalid url, skipping fetch.");
            return;
        }
        const activebox = boxes.filter((e)=>e.isactive)
        if (activebox.length > 0) {
            if (activebox[0].id===1) {
                
            }
            if (activebox[0].id===2) {
                console.log('hello world')
            }
        }
        
        // const response = await fetch('http://localhost:3000/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(
        //         { URL: url }
        //     )
        // })
        // const data = await response.json()
        // setshorten(data.shorturl)
        // console.log('fetch req sent!')
        // urlvalue.current.value = ""
    }

    const handlecopy = (URL) => {
        navigator.clipboard.writeText(URL)
    }

    const handleactive = (id) =>{
        setboxes((prev)=>{
            return prev.map(box=>({...box,isactive:box.id===id}))
        })
    }

    return (
        <section className='h-screen bg-gray-900 flex justify-center items-center p-5'>
            <div className='container bg-gray-800 border-2 border-gray-600 rounded-2xl p-5 w-fit flex flex-col items-center gap-10'>
                <div className='flex justify-center gap-5 flex-wrap w-full'>
                    <input ref={urlvalue} className=' bg-gray-800 text-white  p-3 w-70 rounded-2xl focus:outline-0 font-mono border-2 border-gray-500' type="text" placeholder='URL' />
                    <button onClick={() => { fetchdata(urlvalue.current.value) }} className='bg-gray-900 p-2 text-white rounded-2xl cursor-pointer font-mono w-40 hover:scale-101'>shorten now</button>
                </div>

                <div className='flex w-full gap-5'>

                    {
                        boxes.map((box) => {
                            
                            return (
                                <div onClick={()=>{handleactive(box.id)}} key={box.id} className={`w-15 p-3 h-15 ${box.isactive ? 'bg-gray-900' : 'bg-gray-600'} border-2 border-gray-500 rounded-2xl cursor-pointer hover:scale-101 hover:bg-gray-700`}>
                                    <img className='w-full h-full invert' src={box.img} alt="" />
                                </div>
                            )
                        })
                    }

                    {/* <div className='w-15 p-3 h-15 bg-gray-600 border-2 border-gray-500 rounded-2xl cursor-pointer hover:scale-101 hover:bg-gray-700'>
                        <img className='w-full h-full invert' src={qrcodeimg} alt="" />
                    </div>
                    <div className='w-15 p-3 h-15 bg-gray-600 border-2 border-gray-500 rounded-2xl cursor-pointer hover:scale-101 hover:bg-gray-700'>
                        <img className='w-full h-full invert' src={passimg} alt="" />
                    </div> */}
                </div>
                <div className='w-70 rounded-2xl justify-center flex flex-wrap gap-5'>
                    {shortenurl && (
                        <>
                            <div className='p-4 w-full rounded-2xl bg-gray-900 border-2 border-gray-500 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800 h-15 text-white'>http://localhost:3000/{shortenurl}</div>
                            <button onClick={() => { handlecopy(`http://localhost:3000/${shortenurl}`) }} className='bg-blue-700 p-4 font-bold border-2 w-full text-blue-100 rounded-2xl border-blue-400 cursor-pointer hover:scale-101 font-mono'>Copy Link</button>
                        </>
                    )}
                </div>
            </div>

        </section>
    )
}

export default App