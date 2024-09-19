import styles from './searchBar.module.scss';
import { TbMusicSearch } from "react-icons/tb";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const queryParam = router.query.query
        if (queryParam && router.pathname.includes('search')) {
            setQuery(queryParam.join(' '));
        } else {
            setQuery('')
        }
    }, [router.query]);

    useEffect(() => {
        if (query.trim() !== '') {
            if (!router.pathname.includes('search')) {
                router.push(`/search/${query}`, undefined, { shallow: true });
            } else {
                router.replace(`/search/${query}`, undefined, { shallow: true });
            }
        }
    }, [query]);

    return (
        <div className={styles.searchBarWrapper}>
            <div className={styles.searchBarContainer}>
                <input
                    className={styles.searchBar}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                />
                <TbMusicSearch size={25} className={styles.icon} />
            </div>
        </div>
    );
};

export default SearchBar;
