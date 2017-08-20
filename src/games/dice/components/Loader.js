import React, { Component } from 'react';


class Loader extends Component {
    render() {
        return (
            <section className="loader">
                <div className="loader_inner">
                       <figure id="circle1"></figure>
                        <figure id="circle2"></figure>
                       <figure id="circle3"></figure>
               </div>
            </section>
        );
    }
}

export default Loader;