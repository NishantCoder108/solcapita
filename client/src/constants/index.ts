export const PROTOCOL_CONFIG = {
    NAME: 'SolCapita',
    TOKEN_SYMBOL: 'nSOL',
    NATIVE_TOKEN: 'SOL',
    MIN_STAKE: 0.1,
    MAX_STAKE: 10000,
    CONVERSION_RATE: 10, // 1 SOL = 10 nSOL
    DEFAULT_LOCK_PERIOD: 7, // days
    DEFAULT_APR: 12,
} as const

export const PROTOCOL_MESSAGES = {
    WELCOME_TITLE: 'Welcome to SolCapita',
    WELCOME_SUBTITLE: 'The Premier SOL Staking Protocol',
    WELCOME_DESCRIPTION: 'Transform your SOL into yield-generating nSOL tokens. Earn passive rewards while contributing to network security.',
    STEPS: {
        CONNECT: 'Connect your wallet securely',
        DEPOSIT: 'Deposit SOL to receive nSOL',
        EARN: 'Start earning compound yields'
    },
    FEATURES: {
        SECURITY: 'Secure',
        YIELD: 'High Yield',
        LIQUIDITY: 'Fast Access'
    }
} as const

export const ERROR_MESSAGES = {
    INSUFFICIENT_BALANCE: 'Your balance is insufficient for this transaction',
    INVALID_AMOUNT: 'Please enter a valid amount to proceed',
    MIN_STAKE: `Minimum deposit required is ${PROTOCOL_CONFIG.MIN_STAKE} ${PROTOCOL_CONFIG.NATIVE_TOKEN}`,
    MAX_STAKE: `Maximum deposit limit is ${PROTOCOL_CONFIG.MAX_STAKE} ${PROTOCOL_CONFIG.NATIVE_TOKEN}`,
    LOCKED_TOKENS: 'Your tokens are still in the lock period',
    UNSTAKE_LIMIT: (amount: string) => `Available for withdrawal: ${amount} ${PROTOCOL_CONFIG.TOKEN_SYMBOL}`,
} as const

export const UI_ELEMENTS = {
    CARDS: {
        ANALYTICS: {
            TITLE: 'Protocol Overview',
            SUBTITLE: 'Real-time Metrics & Performance',
            TVL: 'Total Staked Value',
            YOUR_POSITION: 'Your Portfolio',
            APY: 'Annual Percentage Yield',
            LOCK_PERIOD: 'Security Duration',
            SHARE: 'Protocol Ownership Share'
        },
        MANAGEMENT: {
            TITLE: 'Asset Management',
            SUBTITLE: 'Manage Your Staked Assets',
            DEPOSIT: 'Deposit SOL Securely',
            WITHDRAW: 'Withdraw Funds',
            REWARDS: 'Projected Rewards',
            AVAILABLE: 'Available Balance',
            LOCKED: 'Secured Funds',
            PROCESSING: 'Transaction in Progress'
        },
        HISTORY: {
            TITLE: 'Transaction Overview',
            SUBTITLE: 'Your Account Activity',
            DEPOSIT_ACTION: 'Deposited Securely',
            WITHDRAW_ACTION: 'Withdrawn Accessed',
            NO_HISTORY: 'No Transactions Found'
        },

    },
    BUTTONS: {
        CONNECT: 'Connect Securely',
        DEPOSIT: 'Deposit SOL Securely',
        WITHDRAW: 'Withdraw Funds',
        DISCONNECT: 'Disconnect Wallet'
    },
    TOOLTIPS: {
        APY: 'Annual Percentage Yield, compounded daily for higher returns',
        LOCK_PERIOD: 'Security duration for optimal yield generation',
        TVL: 'Total value of assets secured within the protocol',
        REWARDS: 'Estimated daily rewards based on current APY and staking duration'
    }

} as const 