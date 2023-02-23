/* Libraries */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/* Components */
import App from '../App'

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
        await waitFor(() => {
            const stateNames = screen.getAllByRole('heading', { level: 2 })

            expect(stateNames[0]).toHaveTextContent(/.+/)
        })
    })
})
