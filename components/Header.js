import { abi, contractAddresses } from '@/contants';
import { useNotification } from '@web3uikit/core';
import { ConnectButton } from '@web3uikit/web3'
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis';


const Header = () => {


    const [enterenceFee, setenterenceFee] = useState('0')
    const [numOfPlayers, setnumOfPlayers] = useState('0')
    const [recentWinner, setrecentWinner] = useState('0')

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()

    // Another way we could make a contract call:
    // const options = { abi, contractAddress: raffleAddress }
    // const fee = await Moralis.executeFunction({
    //     functionName: "getEntranceFee",
    //     ...options,
    // })

    const dispatch = useNotification()

    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const { runContractFunction: enterRaffle, isFetching, isLoading } =
        useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "enterRaffle",
            params: {},
            msgValue: enterenceFee
        });


    const { data, error, runContractFunction: getEnterenceFee } =
        useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "getEnterenceFee",
            params: {},
        });

    const { runContractFunction: getRecentWinner } =
        useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "getRecentWinner",
            params: {},
        });

    const { runContractFunction: getNumOfPlayers } =
        useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "getNumOfPlayers",
            params: {},
        });

    const handleSuccess = async (tx) => {

        await tx.wait(1)

        dispatch({
            type: 'info',
            message: 'Transaction completed',
            title: 'Tx Notification',
            position: 'topR',
            icon: 'bell'
        })

        UpdateUi()

    }

    async function UpdateUi() {
        const enterenceFee = (await getEnterenceFee()).toString()
        const numOfPlayers = (await getNumOfPlayers()).toString()
        const recentWinner = (await getRecentWinner()).toString()

        setenterenceFee(enterenceFee)
        setrecentWinner(recentWinner)
        setnumOfPlayers(numOfPlayers)
    }

    useEffect(() => {

        if (isWeb3Enabled) {

            UpdateUi()
        }

    }, [isWeb3Enabled])
    

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }


    return (
        <div>
            <ConnectButton moralisAuth={false} />
            {raffleAddress ? (
                <div>
                    <h1 className='font-bold p-3'>
                        Enterence Fee {ethers.utils.formatUnits(enterenceFee, 'ether')} ETH
                    </h1>
                    <button className='bg-green-500 px-3 py-2 rounded-xl'
                        onClick={async () => await enterRaffle({
                            onSuccess: handleSuccess
                        })}
                    >
                        {(isFetching || isLoading) ? <div className='animate-spin h-6 w-6 border-b-2 rounded-full' /> : 'Enter Raffle'}
                    </button>
                    <h1>Num of Players: {numOfPlayers}</h1>
                    <h1>Recent Winner: {recentWinner}</h1>
                </div>
            ) : (
                <h2>Raffle address does not exists</h2>
            )}

        </div>
    )
}

export default Header