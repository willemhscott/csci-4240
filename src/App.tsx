import {useCallback, useEffect, useState} from 'react'
import {Contract, ethers, Provider, Signer} from "ethers";
import {Box, Button, Container, Grid, Paper, TextField} from "@mui/material";


const contracts = [
    "0xFDB96b3d397A0DaE74f9f3170CE10a77Ced1c5B2",
    "0x0634Dd335a9E0e0471Ad4406c6c3f737fd9a894e",
    "0xA62f1EeA59FE325ac565c83DD71157a41B70C74c"
]

// The contract ABI (fragments we care about)
const abi = [
    "function sendMessage(address recipient, string memory content) public",
    "function getMessages() public view returns(tuple(address author, address recipient, string content)[] memory)",
    "event MessageSent(address indexed _from, address indexed _to, string content)"
]

const mainAddress = "0xA62f1EeA59FE325ac565c83DD71157a41B70C74c"

function App() {
    const [, setSigner] = useState<Signer>()
    const [, setProvider] = useState<Provider>()
    const [messages, setMessages] = useState<[string, string, string][]>([])
    const [mainContract, setMainContract] = useState<Contract | null>(null)

    const callback = useCallback(async () => {
        setMessages([]);
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        setProvider(provider);
        setSigner(signer);

        const myAddr = await signer.getAddress()

        const mainContract = new Contract(mainAddress, abi, signer)
        setMainContract(mainContract);
        mainContract.removeAllListeners()
        await mainContract.on("MessageSent", async (_from, _to, content) => {
            console.log(`${_from} => ${_to}: ${content}`);
            if ([_from, _to].includes(myAddr)) {
                setMessages(messages => [...messages, [_from, _to, content]])
            }
        })

        // Create a contract; connected to a Provider, so it may
        // only access read-only methods (like view and pure)
        for (const addr of contracts) {
            const contract = new Contract(addr, abi, signer)

            // Read the token balance for an account
            const messages: [string, string, string][] = await contract.getMessages()
            setMessages(old => [...old, ...messages.filter(m => [m[0], m[1]].includes(myAddr))])
        }

    }, [])


    useEffect(() => {
        callback()
    }, [callback])

    const [recipient, setRecipient] = useState("")
    const [content, setContent] = useState("")

    // const theme = useTheme()

    return (
        <main style={{width: '100vw', height: '100vh'}}>
            <Container maxWidth={'md'} sx={{height: '100vh', paddingTop: 2}}>
                <Paper sx={{padding: 2, maxHeight: '75%', overflowY: 'scroll', marginBottom: 2}} variant={'outlined'}>
                    <Grid container spacing={4} justifyContent={'space-between'} direction={'column'}>
                        <Grid item>
                            <Box sx={{
                                "& > *": {
                                    marginBottom: 2,
                                }
                            }}>
                                {messages.map((item: any) => <Paper variant={'outlined'} sx={{padding: 2}}>
                                    From: {item[0].substring(0, 8)}
                                    <br/>
                                    To: {item[1].substring(0, 8)}
                                    <br/>
                                    Content: {item[2]}
                                </Paper>)}
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth label={'Recipient'} value={recipient}
                                   onChange={(event) => setRecipient(event.target.value)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display={'flex'} sx={{width: '100%'}}>
                            <TextField fullWidth multiline sx={{marginRight: 2}} label={'Content'}
                                       value={content} onChange={(event) => setContent(event.target.value)}/>
                            <Button variant={'contained'} onClick={async () => {
                                if (mainContract) {
                                    // const message = await signer?.signMessage(content)
                                    await mainContract.sendMessage(recipient, content)
                                    setContent("")
                                }
                            }}>Send</Button>
                        </Box>
                    </Grid>
                </Grid>

            </Container>
        </main>
    )
}

export default App
