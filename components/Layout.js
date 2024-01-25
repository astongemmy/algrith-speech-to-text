import ScrollToTop from './ScrollToTop';

const Layout = (props) => {
	return (
		<div>
			{props.children}
			<ScrollToTop />
		</div>
	);
};

export default Layout;