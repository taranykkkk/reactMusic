import Slider from "react-slick";
import styles from './top.module.scss'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useRouter} from "next/router";

const Top = ({data}) => {
    const router = useRouter()

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        arrows: false,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 4,
                    centerMode: false,
                    centerPadding: '0',
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                    centerPadding: '0',
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                    centerPadding: '0',
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    centerMode: false,
                    centerPadding: '0',
                },
            },
        ],
    };

    return (
        <div className='container'>
            <h2 className={styles.topTitle}>Top Mixes</h2>
            <div className={styles.topSliderContainer}>
                <Slider {...settings}>
                    {data?.map(({name, id, description, image: [{url}]}) => (
                        <div className={styles.topSliderCardContainer} key={id} onDoubleClick={() => router.push(`top-mixes/${id}`)}>
                            <img src={url} className={styles.img} alt={description}/>
                            <h3 className={styles.description}>{name}</h3>
                            <span className={styles.circle} style={{height: 50, width: 50, top: 0, left: '-20px'}}/>
                            <span className={styles.circle} style={{height: 150, width: 150, bottom: 20, right: '-60px'}}/>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default Top;