import React, { useState, useEffect } from "react";
import "./AdminHomePage.css"; // We'll reuse common styles here

const SearchBar = ({ onSearch, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Debounce the search input
    useEffect(() => {
        const timerId = setTimeout(() => {
            onSearch(searchTerm);
        }, 300); // 300ms delay

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm, onSearch]);

    return (
        <div className="search-bar-container" style={{ margin: '20px 0', textAlign: 'center' }}>
            <input
                type="text"
                className="search-input"
                placeholder={placeholder || "Search..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    padding: '10px 15px',
                    width: '60%',
                    maxWidth: '400px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '16px'
                }}
            />
        </div>
    );
};

export default SearchBar;
