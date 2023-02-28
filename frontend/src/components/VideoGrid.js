import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Header from "./Header";
import FilterPanel from "./FilterPanel";
import VideoCard from "./VideoCard";
import axios from "axios";
import { Container, Box, CircularProgress, Grid } from "@mui/material";
import { AllGenreParameter } from "../constants/constant";

const VideoGrid = () => {

    const { enqueueSnackBar } = useSnackbar();
    const [videoList, setVideoList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredKeyWords, setFilteredKeyWords] = useState([]);

    useEffect(() => {
        loadVideoLists();
        return (() => loadVideoLists());
    }, []);

    /**
     * function to call movie API (/v1/videos) to return list of movies
    */

    const loadVideoLists = async() => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.endpoint}/videos`);
            if(response.status === 200) {
                setVideoList(response.data.videos);
                setFilteredList(response.data.videos);
            }
        } catch (err) {
            enqueueSnackBar(`${err.message}, something went wrong!`, {variant : "error"});
        }
        setLoading(false);
    }

    /** 
     *  keyword entered in search box to search movies
     * @param string
    */
    const handleSearch = (e) => {
        let value = e.target.value;

        const tempList = videoList.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));

        setFilteredList(tempList);

        if(e.target.value === ""){
            setFilteredList(videoList);
        }

    }

    /**
     *  function to sort videos either by viewCount or releaseDate
     * @param {*} parameter to sort by "releaseDate or viewCount"
    */
    const handleSort = async (parameter) => {
        setLoading(true);

        try {
            const response = await axios.get(`${config.endpoint}/videos?sortBy=${parameter}`);

            if(response.status === 200) {
                if(parameter === "releaseDate") {
                    setFilteredList(videoList);
                } else {
                    setFilteredList(response.data.videos);
                }
            }
        } catch (err) {
            const {response} = err;
            if(response && response.status === 400) {
                enqueueSnackBar(response.data.message, {variant: "error"});
            } else {
                enqueueSnackBar(`${err.message}, Something went wrong!`, {variant: "error"});
            }
        }

        setLoading(false);
    }

    /**
     * 
     * @param {*} item genre name by which to apply filter
    */
    const genreFilterHandler = async(item) => {
        setLoading(true);

        try {
            let searchKeywords;
            let tempKeywords = [...filteredKeyWords];

            if(item !== AllGenreParameter) {
                if(tempKeywords.includes(item)) {
                    tempKeywords.splice(tempKeywords.indexOf(item), 1);
                } else {
                    tempKeywords.push(item);
                }
                setFilteredKeyWords(tempKeywords);

                if(!tempKeywords.length) {
                    searchKeywords = AllGenreParameter;
                } else {
                    searchKeywords = tempKeywords.join(',');
                }
            } else if(item === AllGenreParameter) {
                searchKeywords = AllGenreParameter;
                tempKeywords = [];
                setFilteredKeyWords(tempKeywords);
            }

            const response = await axios.get(`${config.endpoint}/videos?genres=${searchKeywords}`);

            if(response.status === 200) {
                setFilteredList(response.data.videos);
            }

        } catch (err) {
            const {response} = err;

            if(response && response.status === 400) {
                enqueueSnackBar(response.data.message, {variant: "error"});
            } else {
                enqueueSnackBar(`${err.message}, Something went wrong!`, {variant: "error"});
            }

        }

        setLoading(false);
    }

    return (
        <>
            <Header handleSearch = {handleSearch}/>
            <FilterPanel handleSorting = {handleSort} videoLists = {videoList} genreFilterHandler = {genreFilterHandler}/>
            <Container>
            {
                loading ?
                <Box sx= {{ height: '100vh', display: 'flex', justifyContent: 'centre', alignItems: 'centre' }}>
                    <CircularProgress />
                </Box>
                :
                <Grid container spacing = {2} sx= {{ display: 'flex', flexWrap: 'wrap'}}>
                    {
                        filteredList && filteredList.length ? 
                        filteredList.map(item => {
                            return (
                                <Grid item xs = {6} md = {3} key= {item._id}>
                                    <VideoCard videos = {item} videoList = {videoList} fromVideoDetails={true} />
                                </Grid>
                            )
                        })
                        :
                        <></>
                    }
                </Grid>
            }
            </Container>
        </>
    );

}

export default VideoGrid;