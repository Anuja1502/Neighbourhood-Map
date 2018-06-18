import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'

class Suggestions_Location extends Component{
	state={query: ''}

    updateQuery = (query) => {
     this.setState({ query: query.trim() })
   }
   
 render() {
     const { locations, makeMarker, App} = this.props
     const { query } = this.state
 
     let showingLocations
     if (query) {
       const match = new RegExp(escapeRegExp(query), 'i')
       showingLocations = locations.filter((location) => match.test(location.title))
     } else {
       showingLocations = locations
     }
 
     return (
       <div>
           <input
             className='search-bar'
             type='text'
             placeholder='Search suggestions'
             value={query}
             onChange={(event) => this.updateQuery(event.target.value)}
             aria-labelledby="Search from suggestions"
           />
 
         <div id='suggestion-list'>
           {showingLocations.map((location,index) =>  
               <button id={index} onClick={makeMarker.bind(index, App)}> {location.title} </button> )}
         </div>
       </div>
     )
   }
 }
 
 export default Suggestions_Location;