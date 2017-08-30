import React, {Component} from 'react';

class Slider extends Component {
    constructor(props){
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
  
    componentDidMount() {
      this.x = 0
      this.y = 0
  
      document.addEventListener("mousemove", this.handleMouseMove)
      document.addEventListener("mouseup", this.handleMouseUp)
    }
  
    componentWillUnmount() {
      document.removeEventListener("mousemove", this.handleMouseMove)
      document.removeEventListener("mouseup", this.handleMouseUp)
    }
  
    handleMouseUp = () => {
      this.props.isPinching = true;
    };
  
    handleMouseDown = (e) => {
      e.preventDefault()
  
      const { left, top, width, height } = this.potar.getBoundingClientRect()
  
      this.x = e.pageX - (left + width / 2)
      this.y = (top + height / 2) - e.pageY
  
      this.props.isPinching = true;
    };
  
    handleMouseMove = (e) => {
      if (this.props.isPinching) {
        const { left, top, width, height } = this.potar.getBoundingClientRect()
  
        const x = e.pageX - (left + width / 2)
        const y = (top + height / 2) - e.pageY
  
        const dx = (x - this.x) / 100
        const dy = (y - this.y) / 100
  
        this.x = x
        this.y = y
        
        if (this.props.onChange) {
          let xValue = this.props.value + dx
          let yValue = this.props.value + dy
          
          if (xValue < 0) {
            xValue = 0
          }
          
          if (xValue > 1) {
            xValue = 1
          }
          
          if (yValue < 0) {
            yValue = 0
          }
          
          if (yValue > 1) {
            yValue = 1
          }
          
          this.props.onChange(xValue, yValue)
        }
      }
    };
    handleChange(e){
        this.props.value = e.target.value;
    };
    
    render() {

      const { radius, border, value } = this.props
      const p = 2 * Math.PI * (radius - border / 2)
      
      const strokeWidth = border
      const strokeDashoffset = p * (1 - value)
      const strokeDasharray = p
  
      return (
        <svg
          className="Slider"
          ref={ (potar) => this.potar = potar }
          viewBox={ `0 0 ${ radius * 2 } ${ radius * 2 }` }
          onMouseDown={ this.handleMouseDown }>
          <circle
            className="Slider-circle"
            style={{ strokeWidth }}
            r={ radius - border / 2 }
            cx={ radius }
            cy={ radius } />
  
          <circle
            className="Slider-bar"
            style={{
              strokeWidth,
              strokeDashoffset,
              strokeDasharray,
            }}
            r={ radius - border / 2 }
            cx={ radius }
            cy={ radius } />
        </svg>
      )
    }
  }


  Slider.defaultProps = {
    
      border: 10,
      radius: 100,
      value: 0,
      isPinching: false
    
  }
  export default Slider;