import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action'

// Highter Order Component
export default function (SpecificComponent, option, adminRoute = null) {
    // option에 접근 권한을 부여. null(아무나), true(로그인한 유저), false(로그인한 유저는 X)
    // adminRoute는 관리자 접근 권한

    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then((res) => {
                //로그인 상태에 따라 분기처리

                if (!res.payload.isAuth) {
                    if (option) {
                        props.history.push("/login")
                    }
                } else {
                    if (adminRoute && !res.payload.isAdmin) {
                        props.history.push("/")
                    } else if (option === false) {
                        props.history.push("/")
                    }
                }
            });
        }, [dispatch, props.history]);

        return <SpecificComponent {...props} />;
    }
    return AuthenticationCheck;
}
