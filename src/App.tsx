/* Libraries */
import React, { useState, useEffect } from 'react'

/* Components */
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'

/* Styles */
import './App.scss'

/* Types */
interface USState {
    [key: string]: string | number
    'Household Income': number
    'ID State': number
    Population: number
    'Property Value': number
    State: string
    Year: string
    growthRate: number
}

interface dataUSA {
    data: USState[]
}

const dataUSAUrl = 'https://datausa.io/api/data'
const years = ['2019', '2018', '2017', '2016', '2015']
const measures = ['Property Value', 'Household Income', 'Population']
const periods = ['1', '2', '3']

const App = () => {
    const [selectedYear, setSelectedYear] = useState<string>(years[0])
    const [selectedMeasure, setSelectedMeasure] = useState<string>(measures[0])
    const [selectedPeriod, setSelectedPeriod] = useState<string>(periods[0])
    const [USStates, setUSStates] = useState<USState[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedYear(event.target.value)
    }
    const handleMeasureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMeasure(event.target.value)
    }
    const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPeriod(event.target.value)
    }

    useEffect(() => {
        const updateUSStatesWithGrowth = (data: USState[]) => {
            const previousYearData = data.filter(
                (USState) => USState.Year === `${parseInt(selectedYear) - parseInt(selectedPeriod)}`
            )

            return data.map((USState) => {
                const previousYearValue =
                    previousYearData.find(
                        (USStatePrevYear) => USStatePrevYear['ID State'] === USState['ID State']
                    )?.['Property Value'] || 0
                const growthRate =
                    (USState['Property Value'] - previousYearValue) / previousYearValue

                return {
                    ...USState,
                    growthRate,
                }
            })
        }

        const fetchUSStates = async () => {
            setIsLoading(true)

            const response = await fetch(
                `${dataUSAUrl}?drilldowns=State&measures=${measures.join(
                    ','
                )}&year=${selectedYear},${parseInt(selectedYear) - parseInt(selectedPeriod)}`
            )
            const json: dataUSA = await response.json()
            const data = updateUSStatesWithGrowth(json.data)

            setUSStates(data)
            setIsLoading(false)
        }

        fetchUSStates()
    }, [selectedYear, selectedMeasure, selectedPeriod])

    return (
        <div className='app'>
            <div className='formPanel'>
                <Container className='p-3'>
                    <Nav>
                        <Nav.Item className='logo'>
                            <img src='/images/lative-logo.svg' alt='Lative Software' />
                        </Nav.Item>
                    </Nav>
                    <h1 className='header'>Growth Ranking of U.S. States</h1>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor='selectYear'>Year</Form.Label>
                                    <Form.Control
                                        id='selectYear'
                                        as='select'
                                        value={selectedYear}
                                        onChange={handleYearChange}>
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor='selectMeasure'>Measure</Form.Label>
                                    <Form.Control
                                        id='selectMeasure'
                                        as='select'
                                        value={selectedMeasure}
                                        onChange={handleMeasureChange}>
                                        {measures.map((measure) => (
                                            <option key={measure} value={measure}>
                                                {measure}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor='selectPeriod'>Growth Period</Form.Label>
                                    <Form.Control
                                        id='selectPeriod'
                                        as='select'
                                        value={selectedPeriod}
                                        onChange={handlePeriodChange}>
                                        {periods.map((period) => (
                                            <option key={period} value={period}>
                                                {period} {period === '1' ? 'Year' : 'Years'}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>
            <div className='results'>
                <Container>
                    {isLoading ? (
                        <span>Loading...</span>
                    ) : USStates.length ? (
                        <Row as='ul' xs={1} sm={2}>
                            {USStates.filter((data) => data.Year === selectedYear)
                                .sort((a, b) => b.growthRate - a.growthRate)
                                .map((data) => (
                                    <Col as='li' key={data['ID State']}>
                                        <div className='state'>
                                            <div className='state__body'>
                                                <h2 className='state__name'>
                                                    <strong>{data.State}</strong>
                                                </h2>
                                                <div className='state__growth'>
                                                    <small>
                                                        <em>
                                                            {(data.growthRate * 100).toFixed(2)}%
                                                            Growth
                                                        </em>
                                                    </small>
                                                </div>
                                            </div>
                                            <div className='state__measure'>
                                                <h3 style={{ margin: 0 }}>
                                                    {selectedMeasure !== 'Population' && '$'}
                                                    {data[selectedMeasure]}
                                                </h3>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                        </Row>
                    ) : (
                        <span>
                            Either something went wrong or we can not provide the data that far back
                        </span>
                    )}
                </Container>
            </div>
        </div>
    )
}

export default App
