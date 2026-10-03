import { useMemo, useState } from "react";

import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    MenuItem,
    Paper,
    Popover,
    Select,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CircleIcon from "@mui/icons-material/Circle";

import { useNews } from "../../hooks/useNews";

import type {
    NewsArticle,
    NewsCategory,
} from "../../types/news";


/* ============================================================
   CONSTANTS
   ============================================================ */

const NEWS_CATEGORIES: {
    value: NewsCategory;
    label: string;
}[] = [
    {
        value: "stock",
        label: "Stocks",
    },
    {
        value: "sector",
        label: "Sectors",
    },
    {
        value: "market",
        label: "Market",
    },
];


/* ============================================================
   HELPERS
   ============================================================ */

const formatPublishedTime = (
    publishedAt?: string | null
): string => {
    if (!publishedAt) {
        return "Date unavailable";
    }

    const date = new Date(publishedAt);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
    const getSentimentColor = (
        sentiment?: string
    ) => {

        switch (sentiment) {

            case "positive":
                return "success.main";

            case "negative":
                return "error.main";

            case "neutral":
            default:
                return "warning.main";

        }

    };        


/* ============================================================
   COMPONENT
   ============================================================ */

const NewsFeed = () => {

    /* --------------------------------------------------------
       BACKEND NEWS
       -------------------------------------------------------- */

    const {
        data,
        isLoading,
        isError,
    } = useNews();


    /* --------------------------------------------------------
       SELECTION STATE
       -------------------------------------------------------- */

    const [category, setCategory] =
        useState<NewsCategory>("stock");

    const [selectedStock, setSelectedStock] =
        useState<string>("all");

    const [selectedSector, setSelectedSector] =
        useState<string[]>([]);


    /* --------------------------------------------------------
       INFO POPOVER
       -------------------------------------------------------- */

    const [infoAnchor, setInfoAnchor] =
        useState<HTMLElement | null>(null);

    const [selectedArticle, setSelectedArticle] =
        useState<NewsArticle | null>(null);


    /* ========================================================
       OPTIONS
       IMPORTANT:
       These come from NEWS DATA, not portfolio data.
       ======================================================== */

    const stockOptions = useMemo(() => {

        if (!data?.articles) {
            return [];
        }

        return Array.from(
            new Set(
                data.articles
                    .filter(
                        (article) =>
                            article.category === "stock" &&
                            Boolean(article.symbol)
                    )
                    .map(
                        (article) =>
                            article.symbol as string
                    )
            )
        ).sort();

    }, [data]);


    const sectorOptions = useMemo(() => {

        if (!data?.articles) {
            return [];
        }

        return Array.from(
            new Set(
                data.articles
                    .filter(
                        (article) =>
                            article.category === "sector" &&
                            Boolean(article.sector)
                    )
                    .map(
                        (article) =>
                            article.sector as string
                    )
            )
        ).sort();

    }, [data]);


    /* ========================================================
       FILTER NEWS
       ======================================================== */

    const filteredNews = useMemo(() => {

        if (!data?.articles) {
            return [];
        }

        let articles = data.articles.filter(
            (article) =>
                article.category === category
        );


        /* ----------------------------------------------------
           STOCK FILTER
           ---------------------------------------------------- */

        if (
            category === "stock" &&
            selectedStock !== "all"
        ) {
            articles = articles.filter(
                (article) =>
                    article.symbol === selectedStock
            );
        }


        /* ----------------------------------------------------
           SECTOR FILTER
           ---------------------------------------------------- */

        if (
            category === "sector" &&
            selectedSector !== "all"
        ) {
            articles = articles.filter(
                (article) =>
                    article.sector === selectedSector
            );
        }


        /* ----------------------------------------------------
           NEWEST FIRST
           ---------------------------------------------------- */

        return [...articles].sort(
            (a, b) => {

                const dateA = a.published_at
                    ? new Date(a.published_at).getTime()
                    : 0;

                const dateB = b.published_at
                    ? new Date(b.published_at).getTime()
                    : 0;

                return dateB - dateA;
            }
        );

    }, [
        data,
        category,
        selectedStock,
        selectedSector,
    ]);


    /* ========================================================
       CATEGORY CHANGE
       ======================================================== */

    const handleCategoryChange = (
        newCategory: NewsCategory
    ) => {

        setCategory(newCategory);

        setSelectedStock("all");
        setSelectedSector("all");
    };


    /* ========================================================
       INFO BUTTON
       ======================================================== */

    const handleInfoClick = (
        event: React.MouseEvent<HTMLElement>,
        article: NewsArticle
    ) => {

        event.stopPropagation();

        setInfoAnchor(event.currentTarget);
        setSelectedArticle(article);
    };


    const handleCloseInfo = () => {

        setInfoAnchor(null);
        setSelectedArticle(null);
    };


    /* ========================================================
       LOADING
       ======================================================== */

    if (isLoading) {

        return (
            <Paper
                sx={{
                    p: 2,
                    height: "100%",
                    minHeight: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                }}
            >
                <CircularProgress size={28} />
            </Paper>
        );
    }


    /* ========================================================
       ERROR
       ======================================================== */

    if (isError) {

        return (
            <Paper sx={{ p: 2 }}>

                <Typography
                    color="error"
                    variant="body2"
                >
                    Failed to load news.
                </Typography>

            </Paper>
        );
    }


    /* ========================================================
       UI
       ======================================================== */

    return (
        <Paper
            sx={{
                p: 2,

                /*
                 * Keep the NewsFeed constrained to the
                 * dashboard cell instead of allowing the
                 * article list to determine the height.
                 */
                height: "100%",
                minHeight: 0,
                width: "100%",
                boxSizing: "border-box",

                display: "flex",
                flexDirection: "column",

                /*
                 * The outer NewsFeed must not scroll.
                 * Only the news list below should scroll.
                 */
                overflow: "hidden",
            }}
        >

            {/* =================================================
                HEADER
               ================================================= */}

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    mb: 1.5,
                    flexShrink: 0,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    News
                </Typography>

            </Stack>


            {/* =================================================
                CATEGORY BUTTONS
               ================================================= */}

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    mb: 1.5,
                    flexShrink: 0,
                }}
            >

                {NEWS_CATEGORIES.map((item) => (

                    <Button
                        key={item.value}
                        size="small"
                        variant={
                            category === item.value
                                ? "contained"
                                : "outlined"
                        }
                        onClick={() =>
                            handleCategoryChange(
                                item.value
                            )
                        }
                        sx={{
                            borderRadius: 5,
                            textTransform: "none",
                            minWidth: 80,
                        }}
                    >
                        {item.label}
                    </Button>

                ))}

            </Stack>


            {/* =================================================
                STOCK SELECTOR
               ================================================= */}

            {category === "stock" && (

                <Select
                    size="small"
                    value={selectedStock}
                    onChange={(event) =>
                        setSelectedStock(
                            event.target.value
                        )
                    }
                    displayEmpty
                    fullWidth
                    sx={{
                        mb: 1.5,
                        flexShrink: 0,
                    }}
                >

                    <MenuItem value="all">
                        All Invested Stocks
                    </MenuItem>

                    {stockOptions.map((symbol) => (

                        <MenuItem
                            key={symbol}
                            value={symbol}
                        >
                            {symbol}
                        </MenuItem>

                    ))}

                </Select>

            )}


            {/* =================================================
                SECTOR SELECTOR
               ================================================= */}

            {category === "sector" && (

                <Select
                    size="small"
                    value={selectedSector}
                    onChange={(event) =>
                        setSelectedSector(
                            event.target.value
                        )
                    }
                    displayEmpty
                    fullWidth
                    sx={{
                        mb: 1.5,
                        flexShrink: 0,
                    }}
                >

                    <MenuItem value="all">
                        All Invested Sectors
                    </MenuItem>

                    {sectorOptions.map((sector) => (

                        <MenuItem
                            key={sector}
                            value={sector}
                        >
                            {sector}
                        </MenuItem>

                    ))}

                </Select>

            )}


            {/* =================================================
                MARKET
               ================================================= */}

            {category === "market" && (

                <Chip
                    label="NIFTY 50"
                    size="small"
                    sx={{
                        alignSelf: "flex-start",
                        mb: 1.5,
                        flexShrink: 0,
                    }}
                />

            )}


            <Divider
                sx={{
                    flexShrink: 0,
                }}
            />


            {/* =================================================
                SCROLLABLE NEWS AREA
               ================================================= */}

            <Box
                sx={{
                    /*
                     * This is the ONLY scrolling region.
                     */
                    flex: "1 1 0",
                    minHeight: 0,

                    overflowY: "auto",
                    overflowX: "hidden",

                    mt: 1,
                    pr: 0.5,

                    /*
                     * Make sure the scroll container cannot
                     * grow because of its children.
                     */
                    width: "100%",
                    boxSizing: "border-box",

                    "&::-webkit-scrollbar": {
                        width: 6,
                    },

                    "&::-webkit-scrollbar-thumb": {
                        borderRadius: 3,
                    },
                }}
            >

                {filteredNews.length === 0 ? (

                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            height: 180,
                        }}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No news available.
                        </Typography>

                    </Stack>

                ) : (

                    <Stack spacing={1}>

                        {filteredNews.map(
                            (article) => (

                                <Paper
                                    key={
                                        article.article_id
                                    }
                                    variant="outlined"
                                    sx={{
                                        p: 1.25,

                                        borderRadius: 2,

                                        /*
                                         * Prevent the article tile
                                         * from stretching the parent.
                                         */
                                        width: "100%",
                                        maxWidth: "100%",
                                        boxSizing: "border-box",

                                        overflow: "hidden",

                                        flexShrink: 0,
                                    }}
                                >

                                    {/* -----------------------
                                        ARTICLE HEADER
                                       ----------------------- */}

                                    <Stack
                                        direction="row"
                                        spacing={0.75}
                                        alignItems="flex-start"
                                        sx={{
                                            minWidth: 0,
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                flex: 1,
                                                minWidth: 0,

                                                overflow: "hidden",
                                            }}
                                        >

                                            {/* TITLE */}

                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                component="a"
                                                href={article.google_news_url || undefined}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                    lineHeight: 1.35,

                                                    /*
                                                     * Prevent a very long
                                                     * title from breaking
                                                     * the card layout.
                                                     */
                                                    overflow: "hidden",
                                                    display:"-webkit-box",
                                                    WebkitBoxOrient:"vertical",

                                                    WebkitLineClamp: 2,

                                                    wordBreak:
                                                        "break-word",
                                                    color: "inherit",
                                                    textDecoration: "none",
                                                    cursor: article.google_news_url
                                                        ? "pointer"
                                                        : "default",
                                                    "&:hover": {
                                                        textDecoration: article.google_news_url
                                                            ? "underline"
                                                            : "none",
                                                    },

                                                }}
                                            >
                                                {article.title}
                                            </Typography>


                                            {/* SOURCE + DATE */}

                                            <Stack
                                                direction="row"
                                                spacing={0.75}
                                                alignItems="center"
                                                sx={{
                                                    mt: 0.75,

                                                    minWidth: 0,
                                                }}
                                            >

                                                {article.source && (

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        noWrap
                                                        sx={{
                                                            maxWidth:
                                                                "45%",
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                        }}
                                                    >
                                                        {
                                                            article.source
                                                        }
                                                    </Typography>

                                                )}


                                                {article.source && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        •
                                                    </Typography>
                                                )}


                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    noWrap
                                                >
                                                    {formatPublishedTime(
                                                        article.published_at
                                                    )}
                                                </Typography>

                                            </Stack>

                                        </Box>

                                        {/* SENTIMENT + INFO BUTTON */}

                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={0.25}
                                            sx={{
                                                flexShrink: 0,
                                            }}
                                        >

                                            {/* SENTIMENT */}

                                            <Tooltip
                                                title={
                                                    article.sentiment === "positive"
                                                        ? "Positive news"
                                                        : article.sentiment === "negative"
                                                            ? "Negative news"
                                                            : "Neutral / informational update"
                                                }
                                            >

                                                <CircleIcon
                                                    sx={{
                                                        fontSize: 10,
                                                        color: getSentimentColor(
                                                            article.sentiment
                                                        ),
                                                    }}
                                                />

                                            </Tooltip>


                                            {/* INFO */}

                                            <Tooltip
                                                title="More information"
                                            >

                                                <IconButton
                                                    size="small"
                                                    onClick={(event) =>
                                                        handleInfoClick(
                                                            event,
                                                            article
                                                        )
                                                    }
                                                >

                                                    <InfoOutlinedIcon
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>

                                        </Stack>

                                    </Stack>

                                </Paper>

                            )
                        )}

                    </Stack>

                )}

            </Box>


            {/* =================================================
                INFO POPOVER
               ================================================= */}

            <Popover
                open={Boolean(infoAnchor)}
                anchorEl={infoAnchor}
                onClose={handleCloseInfo}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >

                {selectedArticle && (

                    <Box
                        sx={{
                            p: 2,
                            width: 300,
                            maxWidth: "80vw",
                        }}
                    >

                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{
                                mb: 1,
                            }}
                        >
                            Article Information
                        </Typography>


                        {/* CATEGORY */}

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Category
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                textTransform: "capitalize",
                            }}
                        >
                            {selectedArticle.category}
                        </Typography>


                        {/* STOCK */}

                        {selectedArticle.symbol && (

                            <>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Stock
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 1,
                                    }}
                                >
                                    {
                                        selectedArticle.symbol
                                    }
                                </Typography>
                            </>

                        )}


                        {/* SECTOR */}

                        {selectedArticle.sector && (

                            <>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Sector
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 1,
                                    }}
                                >
                                    {
                                        selectedArticle.sector
                                    }
                                </Typography>
                            </>

                        )}


                        {/* QUERY */}

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Search Query
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                wordBreak: "break-word",
                            }}
                        >
                            {selectedArticle.query}
                        </Typography>


                        {/* PUBLISHED DATE */}

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Published
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1.5,
                            }}
                        >
                            {formatPublishedTime(
                                selectedArticle.published_at
                            )}
                        </Typography>


                        {/* OPEN ARTICLE */}

                        {selectedArticle.google_news_url && (

                            <Button
                                size="small"
                                variant="outlined"
                                endIcon={
                                    <OpenInNewIcon />
                                }
                                component="a"
                                href={
                                    selectedArticle.google_news_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                fullWidth
                            >
                                Read Article
                            </Button>

                        )}

                    </Box>

                )}

            </Popover>

        </Paper>
    );
};


export default NewsFeed;