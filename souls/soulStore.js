
  toggleBuying = () => {
        let {buying} = this.state;
        buying = !buying;
        this.setState({buying})
    };

    componentDidUpdate() {
        if (this.state.buying) {
            this.setState({buying: false})
        }
    }

    componentDidMount() {
        const script = document.createElement('script');
        script.src = 'https://instant.0xproject.com/instant.js';

        script.onload = () => this.setState({done: true});

        document.head.appendChild(script);

    }