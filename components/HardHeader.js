import React, { useEffect } from 'react'
import { useMoralis } from "react-moralis";


const HardHeader = () => {

    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    useEffect(() => {

        if (isWeb3Enabled) return

        if (localStorage.getItem('connected')) {
            enableWeb3()
        }

    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (account === null) {
                localStorage.removeItem('connected')
                deactivateWeb3()
            }
        })
    }, [Moralis])



    return (
        <div>
            {account ? (
                <h2>
                    Connected!
                </h2>
            ) : (

                <button
                    onClick={async () => {
                        await enableWeb3();
                        localStorage.setItem('connected', 'injected')
                    }}
                    className='bg-green-500 px-3 py-2 rounded-xl text-white disabled:bg-slate-300'
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )
            }
        </div >
    )
}

export default HardHeader