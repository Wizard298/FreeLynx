import { Link } from "react-router-dom";
import "./GigCard.scss";

const GigCard = (props) => {
  const { data } = props;

  return (
    <Link to={`/gig/${data._id}`} className="link">
      <div className="gigCard">
        <img src={data.cover} alt="Error" />
        <div className="info">
          <div className="user">
            <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
              <img src={data.userID.image || "./media/noavatar.png"} alt="Error" />
              <span>{data.userID.username}</span>
            </div>
            <div>
              {data.location}
            </div>
          </div>
          <div>
            <h2 className="shortTitle-heading">{data.shortTitle}</h2>
            <p className="shortDesc-para">{data.shortDesc}</p>
          </div>

          {/* <p>{data.title}</p> */}
          <div className="star">
            <img src="./media/star.png" alt="" />
            <span>{Math.round(data.totalStars / data.starNumber) || 0}</span>
            <span className="totalStars">({data.starNumber})</span>
          </div>
        </div>

        {/* <br /> */}
        {/* <hr /> */}

        <div className="detail">
          <img src="./media/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>
              {data.price.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
                style: "currency",
                currency: "INR",
              })}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
