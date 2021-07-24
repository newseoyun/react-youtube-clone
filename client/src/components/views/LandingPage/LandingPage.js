import React, {useEffect} from 'react'
import axios from 'axios'

function LandingPage(props) {
/*
    useEffect(() => {
        axios.get('/api/hello')
             .then(res => { console.log("res", res) })
    }, [])
 */
    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(res => {
                if (res.data.success) {
                    props.history.push("/login")
                } else {
                    alert("ERROR!!!");
                }
            })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>LandingPage ~~</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>

        </div>
    )
}

export default LandingPage
