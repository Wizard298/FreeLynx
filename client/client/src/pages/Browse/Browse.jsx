import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosFetch } from "../../utils";
import { GigCard, Loader } from "../../components";
import "./Browse.scss";

const Browse = () => {
  const [sortBy, setSortBy] = useState("sales");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [caetgoryFilter, setCategoryFilter] = useState("");
  const { search } = useLocation();

  // Extract search parameters from URL on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(search);
    setSearchQuery(params.get("search") || "");
    setMinPrice(params.get("min") || "");
    setMaxPrice(params.get("max") || "");
    setLocationFilter(params.get("location") || "");
    setCategoryFilter(params.get("category") || "");
  }, [search]);

  // Construct the query URL with all filters
  const buildQuery = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.append("search", searchQuery);
    if (minPrice) params.append("min", minPrice);
    if (maxPrice) params.append("max", maxPrice);
    if (locationFilter) params.append("location", locationFilter);
    if (caetgoryFilter) params.append("category", caetgoryFilter);
    if (sortBy) params.append("sort", sortBy);

    return `/gigs?${params.toString()}`;
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: [
      "gigs",
      searchQuery,
      minPrice,
      maxPrice,
      locationFilter,
      caetgoryFilter,
      sortBy,
    ],
    queryFn: async () => {
      try {
        const res = await axiosFetch.get(buildQuery());
        setCategory(res.data?.[0]?.category || "all gigs");
        return res.data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  });

  const handleSortBy = (type) => {
    setSortBy(type);
  };

  const handlePriceFilter = () => {
    refetch();
  };

  const handleLocationFilter = () => {
    refetch();
  };

  const handleCategoryFilter = () => {
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <h1>
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Browse All Gigs"}
        </h1>

        <div className="filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Search:</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description, category..."
              />
            </div>

            <div className="filter-group">
              <label>Location:</label>
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by location..."
                onBlur={handleLocationFilter}
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Category:</label>
              <input
                type="text"
                value={caetgoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="Filter by Category..."
                onBlur={handleCategoryFilter}
              />
            </div>

            <div className="filter-group price-filter-group">
              <label>Price Range:</label>
              <div className="price-inputs">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  onBlur={handlePriceFilter}
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  onBlur={handlePriceFilter}
                />
              </div>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortBy(e.target.value)}
              >
                <option value="sales">Best Selling</option>
                <option value="createdAt">Newest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="results-count">{data?.length || 0} gigs found</div>

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
            <div className="no-results">
              <h2>No Gigs Found</h2>
              <p>
                Try adjusting your search filters to find what you're looking
                for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
