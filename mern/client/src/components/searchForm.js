import React, { useState, useEffect, useRef } from "react";

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,{componentRestrictions: { country: "us" } }
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
}

function SearchForm({label, placeholder, id}) {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);


  return (
    <div className="search-location-input form-group">
      <label htmlFor="searchForm">{label}</label>
      <br />
      <input
        ref={autoCompleteRef}
        onChange={event => setQuery(event.target.value)}
        placeholder={placeholder}
        value={query}
        name='searchForm'
        class='form control'
        id={id}
      />
      <label htmlFor="radius">Radius</label>
     <select name="radius">
       <option value="5">5 mi</option>
       <option value="10">10 mi</option>
       <option value="25">25 mi</option>
       <option value="50">50 mi</option>
       <option value="100">100 mi</option>
     </select>
     <label htmlFor="category">Category</label>
     <select name="category">
       <option value="all">All</option>
       <option value="housing">Housing</option>
       <option value="art">Art</option>
     </select>
    </div>
  );
}

export default SearchForm;