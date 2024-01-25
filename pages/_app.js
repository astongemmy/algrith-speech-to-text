import 'bootstrap-icons/font/bootstrap-icons.min.css';
import { useRouter } from 'next/router';

import GlobalStyles from '../styled/global';
import '../public/css/fonts.css';
import '../public/css/app.css';

const App = ({ Component, pageProps: { pageProps }, }) => {
	const router = useRouter();

	return (
	  <>
		  <GlobalStyles />
			<Component key={router.asPath} {...pageProps} />
		</>
	)
};

export default App;