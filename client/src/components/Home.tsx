import React, { useState, useEffect } from 'react';
import  { Redirect, withRouter, RouteComponentProps } from 'react-router-dom'

const Home: React.FunctionComponent<RouteComponentProps> = (): any => {
    return (
        <h1>Home</h1>
    )
}

export default withRouter(Home);