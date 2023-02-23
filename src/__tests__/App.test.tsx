/* Libraries */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/* Components */
import App from '../App'

const USStatesRegEx =
    /(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)/i

test('renders App component', () => {
    render(<App />)

    expect(
        screen.getByRole('heading', { name: 'Growth Ranking of U.S. States' })
    ).toBeInTheDocument()
})

describe('App', () => {
    /**
     * Run loading indicator, US States display and valid growth tests
     * after every other test here
     */
    afterEach(async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        await waitFor(() => screen.findAllByRole('heading', { level: 2 }))

        const stateNames = screen.getAllByRole('heading', { level: 2 })
        const growth = screen.getAllByText(/% Growth/i)

        /**
         * We do not know which USState will end up on which spot in the list
         * so we use RegEx for that purpose
         */
        expect(stateNames[0]).toHaveTextContent(USStatesRegEx)
        expect(stateNames[1]).toHaveTextContent(USStatesRegEx)
        expect(stateNames[2]).toHaveTextContent(USStatesRegEx)

        /**
         * Make sure we have valid growth displayed
         * by checking for at least one number in string
         */
        expect(growth[0].textContent).toMatch(/\d+/)
        expect(growth[1].textContent).toMatch(/\d+/)
        expect(growth[2].textContent).toMatch(/\d+/)
    })

    test('selects year', async () => {
        render(<App />)

        const yearSelect = screen.getByLabelText('Year')

        userEvent.selectOptions(yearSelect, '2018')

        await waitFor(() => {
            expect(yearSelect).toHaveValue('2018')
        })
    })

    test('selects measure', async () => {
        render(<App />)

        const measureSelect = screen.getByLabelText('Measure')

        userEvent.selectOptions(measureSelect, 'Population')

        await waitFor(() => {
            expect(measureSelect).toHaveValue('Population')
        })
    })

    test('selects growth period', async () => {
        render(<App />)

        const periodSelect = screen.getByLabelText('Growth Period')

        userEvent.selectOptions(periodSelect, '3')

        await waitFor(() => {
            expect(periodSelect).toHaveValue('3')
        })

        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
})
