/* Libraries */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/* Components */
import App from '../App'

const USStatesRegEx =
    /(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)/i

describe('App', () => {
    test('renders App component', () => {
        render(<App />)

        expect(
            screen.getByRole('heading', { name: 'Growth Ranking of U.S. States' })
        ).toBeInTheDocument()
    })

    test('updates the state when selecting year', async () => {
        render(<App />)

        const yearSelect = screen.getByLabelText('Year')

        userEvent.selectOptions(yearSelect, '2018')

        await waitFor(() => {
            expect(yearSelect).toHaveValue('2018')
        })
    })

    test('updates the state when selecting measure', async () => {
        render(<App />)

        const measureSelect = screen.getByLabelText('Measure')

        userEvent.selectOptions(measureSelect, 'Population')

        await waitFor(() => {
            expect(measureSelect).toHaveValue('Population')
        })
    })

    test('updates the state when selecting growth period', async () => {
        render(<App />)

        const periodSelect = screen.getByLabelText('Growth Period')

        userEvent.selectOptions(periodSelect, '3')

        await waitFor(() => {
            expect(periodSelect).toHaveValue('3')
        })
    })

    test('makes sure loading state is shown', async () => {
        render(<App />)

        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('makes sure US States are loaded', async () => {
        render(<App />)

        await waitFor(() => screen.findAllByRole('heading', { level: 2 }))

        const stateNames = screen.getAllByRole('heading', { level: 2 })

        expect(stateNames[0]).toHaveTextContent(USStatesRegEx)
        expect(stateNames[1]).toHaveTextContent(USStatesRegEx)
        expect(stateNames[2]).toHaveTextContent(USStatesRegEx)
    })
})
