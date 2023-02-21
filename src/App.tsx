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

interface PropertyData {
    'Household Income': number
    'ID State': number
    Population: number
    'Property Value': number
    State: string
    Year: string
    growthRate: number
    [key: string]: string | number
}

interface ApiResponse {
    data: PropertyData[]
}

const apiUrl = 'https://datausa.io/api/data'

const years = ['2019', '2018', '2017', '2016', '2015']
const measures = ['Property Value', 'Household Income', 'Population']
const periods = ['1', '2', '3']

const App = () => {
    const [selectedYear, setSelectedYear] = useState<string>(years[0])
    const [selectedMeasure, setSelectedMeasure] = useState<string>(measures[0])
    const [selectedPeriod, setSelectedPeriod] = useState<string>(periods[0])
    const [propertyData, setPropertyData] = useState<PropertyData[]>([])
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
        setIsLoading(true)

        const calculateYoYGrowth = (data: PropertyData[]) => {
            const previousYearData = data.filter(
                (d) => d.Year === `${parseInt(selectedYear) - parseInt(selectedPeriod)}`
            )

            return data.map((d) => {
                const previousValue =
                    previousYearData.find((pd) => pd['ID State'] === d['ID State'])?.[
                        'Property Value'
                    ] || 0
                const growthRate = (d['Property Value'] - previousValue) / previousValue

                return {
                    ...d,
                    growthRate,
                }
            })
        }

        const fetchData = async () => {
            const response = await fetch(
                `${apiUrl}?drilldowns=State&measures=${measures.join(',')}&year=${selectedYear},${
                    parseInt(selectedYear) - parseInt(selectedPeriod)
                }`
            )
            const json: ApiResponse = await response.json()

            console.log(json.data)

            const data = calculateYoYGrowth(json.data)

            setPropertyData(data)
            setIsLoading(false)
        }

        fetchData()
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
                                    <Form.Label>Year</Form.Label>
                                    <Form.Control
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
                                    <Form.Label>Measure</Form.Label>
                                    <Form.Control
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
                                    <Form.Label>Growth Period</Form.Label>
                                    <Form.Control
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
                        'Loading...'
                    ) : propertyData.length ? (
                        <ul>
                            {propertyData
                                .filter((data) => data.Year === selectedYear)
                                .sort((a, b) => b.growthRate - a.growthRate)
                                .map((data) => (
                                    <li key={data['ID State']}>
                                        {data.State}: {selectedMeasure !== 'Population' && '$'}
                                        {data[selectedMeasure]} (
                                        {(data.growthRate * 100).toFixed(2)}% YoY growth)
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        'Either something went wrong or we can not provide the data that far back'
                    )}
                </Container>
            </div>
        </div>
    )
}

export default App
