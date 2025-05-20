import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosFetch } from "../../utils";
import { GigCard, Loader } from "../../components";
import "./Gigs.scss";

const Gigs = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [sortBy, setSortBy] = useState("sales");
  const [category, setCategory] = useState("");
  const minRef = useRef();
  const maxRef = useRef();
  const { search } = useLocation();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Construct the query URL
  const buildQuery = () => {
    const min = minRef.current?.value || "";
    const max = maxRef.current?.value || "";
    return `/gigs${search}&min=${min}&max=${max}&sort=${sortBy}`;
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", sortBy, search],
    queryFn: async () => {
      try {
        const res = await axiosFetch.get(buildQuery());
        setCategory(res.data?.[0]?.category || "gigs");
        return res.data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [sortBy, search]);

  const handleSortBy = (type) => {
    setSortBy(type);
    setOpenMenu(false);
    refetch();
  };

  const handlePriceFilter = () => {
    refetch();
  };

  const capitalizedCategory = category
    ? category[0]?.toUpperCase() + category.slice(1)
    : "Gigs";

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">
          FreeLynx {">"} {capitalizedCategory}
        </span>
        <h1>{capitalizedCategory}</h1>
        <p>
          Explore the boundaries of art and technology with FreeLynx's{" "}
          {capitalizedCategory} artists
        </p>

        <div className="menu">
          <div className="left">
            <span>
              <b>Budget</b>{" "}
            </span>
            <input ref={minRef} type="number" placeholder="Min" />
            <input ref={maxRef} type="number" placeholder="Max" />
            <button onClick={handlePriceFilter}>Apply</button>
          </div>

          <div className="right">
            <span className="sortBy">Sort By</span>
            <span className="sortType" onClick={() => setOpenMenu(!openMenu)}>
              {sortBy === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img
              src="/media/down.png"
              alt="Dropdown"
              onClick={() => setOpenMenu(!openMenu)}
            />
            {openMenu && (
              <div className="rightMenu">
                {sortBy !== "sales" ? (
                  <span onClick={() => handleSortBy("sales")}>
                    Best Selling
                  </span>
                ) : (
                  <span onClick={() => handleSortBy("createdAt")}>Newest</span>
                )}
              </div>
            )}
          </div>
        </div>

        <br />
        <div className="cards">
          {isLoading ? (
            <div className="loader">
              <Loader size={45} />
            </div>
          ) : error ? (
            <div className="error">
              Something went wrong. Please try again later.
            </div>
          ) : data && data.length > 0 ? (
            data.map((gig) => <GigCard key={gig._id} data={gig} />)
          ) : (
            <>
              <h1>No Gigs Found!</h1>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gigs;
