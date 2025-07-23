'use client'
import {
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material'

export default function ExampleWithShades() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Typography variant="h3" className="text-center text-primary-700 mb-8">
          Color System with Shades
        </Typography>

        {/* Color Shades Showcase */}
        <Paper className="p-6 mb-8 shadow-md rounded-lg">
          <Typography variant="h5" className="mb-4 text-gray-800">
            Primary Color Shades
          </Typography>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
            {/* Hardcoded primary color shades */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-primary-50"></div>
              <span className="mt-1 text-xs">50</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-primary-100"></div>
              <span className="mt-1 text-xs">100</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-primary-200"></div>
              <span className="mt-1 text-xs">200</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-primary-300"></div>
              <span className="mt-1 text-xs">300</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-primary-400"></div>
              <span className="mt-1 text-xs">400</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-primary-500"></div>
              <span className="mt-1 text-xs">500</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-primary-600"></div>
              <span className="mt-1 text-xs">600</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-primary-700"></div>
              <span className="mt-1 text-xs">700</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-primary-800"></div>
              <span className="mt-1 text-xs">800</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-primary-900"></div>
              <span className="mt-1 text-xs">900</span>
            </div>
          </div>

          <Typography variant="h5" className="mt-6 mb-4 text-gray-800">
            Secondary Color Shades
          </Typography>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
            {/* Hardcoded secondary color shades */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-50"></div>
              <span className="mt-1 text-xs">50</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-100"></div>
              <span className="mt-1 text-xs">100</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-200"></div>
              <span className="mt-1 text-xs">200</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-300"></div>
              <span className="mt-1 text-xs">300</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-400"></div>
              <span className="mt-1 text-xs">400</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-500"></div>
              <span className="mt-1 text-xs">500</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-600"></div>
              <span className="mt-1 text-xs">600</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-700"></div>
              <span className="mt-1 text-xs">700</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-800"></div>
              <span className="mt-1 text-xs">800</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-900"></div>
              <span className="mt-1 text-xs">900</span>
            </div>
          </div>

          <Typography variant="h5" className="mt-6 mb-4 text-gray-800">
            Gray Shades
          </Typography>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {/* Hardcoded gray color shades */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-gray-50"></div>
              <span className="mt-1 text-xs">50</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-gray-100"></div>
              <span className="mt-1 text-xs">100</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-gray-200"></div>
              <span className="mt-1 text-xs">200</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-gray-300"></div>
              <span className="mt-1 text-xs">300</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-gray-400"></div>
              <span className="mt-1 text-xs">400</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-gray-500"></div>
              <span className="mt-1 text-xs">500</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-gray-600"></div>
              <span className="mt-1 text-xs">600</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-gray-700"></div>
              <span className="mt-1 text-xs">700</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-gray-800"></div>
              <span className="mt-1 text-xs">800</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-md bg-gray-900"></div>
              <span className="mt-1 text-xs">900</span>
            </div>
          </div>
        </Paper>

        {/* Button Examples */}
        <Paper className="p-6 mb-8 shadow-md rounded-lg">
          <Typography variant="h5" className="mb-4 text-gray-800">
            Button Examples with Shades
          </Typography>

          <div className="space-y-6">
            <div className="space-y-2">
              <Typography
                variant="subtitle1"
                className="text-gray-700 font-medium"
              >
                MUI Buttons (using palette)
              </Typography>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="contained"
                  color="primary"
                  className="shadow-sm"
                >
                  Primary
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className="shadow-sm"
                >
                  Secondary
                </Button>
                <Button variant="contained" color="error" className="shadow-sm">
                  Error
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  className="shadow-sm"
                >
                  Warning
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  className="shadow-sm"
                >
                  Success
                </Button>
                <Button variant="contained" color="info" className="shadow-sm">
                  Info
                </Button>
              </div>
            </div>

            <Divider className="my-4" />

            <div className="space-y-2">
              <Typography
                variant="subtitle1"
                className="text-gray-700 font-medium"
              >
                Tailwind Buttons (using color shades)
              </Typography>
              <div className="flex flex-wrap gap-2">
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded shadow-sm transition-colors duration-200">
                  Primary 500
                </button>
                <button className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded shadow-sm transition-colors duration-200">
                  Primary 700
                </button>
                <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded shadow-sm transition-colors duration-200">
                  Secondary 500
                </button>
                <button className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 rounded shadow-sm transition-colors duration-200">
                  Error 500
                </button>
              </div>
            </div>
          </div>
        </Paper>

        {/* Text Examples */}
        <Paper className="p-6 shadow-md rounded-lg">
          <Typography variant="h5" className="mb-4 text-gray-800">
            Text Examples with Shades
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography
                variant="subtitle1"
                className="mb-2 font-medium text-gray-800"
              >
                MUI Typography
              </Typography>
              <Typography variant="body1" color="primary" className="mb-2">
                Primary Text Color
              </Typography>
              <Typography variant="body1" color="secondary" className="mb-2">
                Secondary Text Color
              </Typography>
              <Typography variant="body1" color="error" className="mb-2">
                Error Text Color
              </Typography>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2 text-gray-800">
                Tailwind Text Colors
              </h3>
              <p className="text-primary-500 mb-2">Text in primary-500</p>
              <p className="text-primary-700 mb-2">Text in primary-700</p>
              <p className="text-secondary-500 mb-2">Text in secondary-500</p>
              <p className="text-gray-700 mb-2">Text in gray-700</p>
              <p className="text-error-500 mb-2">Text in error-500</p>
            </div>
          </div>
        </Paper>

        {/* Additional MUI components with Tailwind styling */}
        <Paper className="p-6 mt-8 shadow-md rounded-lg">
          <Typography variant="h5" className="mb-6 text-gray-800">
            Additional MUI Components
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form Controls */}
            <div className="space-y-4">
              <Typography variant="h6" className="text-gray-700 mb-4">
                Form Controls
              </Typography>

              <FormControl fullWidth className="mb-4">
                <InputLabel
                  id="demo-simple-select-label"
                  className="text-gray-700"
                >
                  Age
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Age"
                  defaultValue={10}
                  className="bg-white shadow-sm"
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                className="mb-4 bg-white shadow-sm"
              />

              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                className="bg-white shadow-sm"
              />
            </div>

            {/* Cards */}
            <div>
              <Typography variant="h6" className="text-gray-700 mb-4">
                Cards
              </Typography>

              <div className="space-y-4">
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardContent>
                    <Typography variant="h6" className="text-primary-700 mb-2">
                      Card Title
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      This is a MUI card with Tailwind classes for styling. It
                      demonstrates how both libraries can be used together
                      effectively.
                    </Typography>
                  </CardContent>
                  <CardActions className="bg-gray-50 px-4 py-2">
                    <Button
                      size="small"
                      className="text-primary-600 hover:text-primary-800"
                    >
                      Learn More
                    </Button>
                    <Button
                      size="small"
                      className="text-secondary-600 hover:text-secondary-800"
                    >
                      Share
                    </Button>
                  </CardActions>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-secondary-500">
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="text-secondary-700 mb-2"
                    >
                      Featured Card
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      A featured card with a border accent and custom styling.
                    </Typography>
                  </CardContent>
                  <CardActions className="bg-gray-50 px-4 py-2">
                    <Button
                      size="small"
                      className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-1 rounded"
                    >
                      Action
                    </Button>
                  </CardActions>
                </Card>
              </div>
            </div>
          </div>
        </Paper>

        {/* Additional Color Showcase */}
        <Paper className="p-6 mt-8 shadow-md rounded-lg">
          <Typography variant="h5" className="mb-6 text-gray-800">
            Error, Warning, Info, and Success Colors
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Error Colors */}
            <div>
              <Typography variant="h6" className="text-error-700 mb-4">
                Error Color Shades
              </Typography>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="w-12 h-12 rounded-md bg-error-50"></div>
                <div className="w-12 h-12 rounded-md bg-error-100"></div>
                <div className="w-12 h-12 rounded-md bg-error-200"></div>
                <div className="w-12 h-12 rounded-md bg-error-300"></div>
                <div className="w-12 h-12 rounded-md bg-error-400"></div>
                <div className="w-12 h-12 rounded-md bg-error-500"></div>
                <div className="w-12 h-12 rounded-md bg-error-600"></div>
                <div className="w-12 h-12 rounded-md bg-error-700"></div>
                <div className="w-12 h-12 rounded-md bg-error-800"></div>
                <div className="w-12 h-12 rounded-md bg-error-900"></div>
              </div>
              <div className="bg-error-50 text-error-900 p-4 rounded-lg border-l-4 border-error-500">
                <p className="font-medium">Error Alert</p>
                <p className="text-sm mt-1">
                  This is an example of an error alert using the error color
                  palette.
                </p>
              </div>
            </div>

            {/* Warning Colors */}
            <div>
              <Typography variant="h6" className="text-warning-700 mb-4">
                Warning Color Shades
              </Typography>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="w-12 h-12 rounded-md bg-warning-50"></div>
                <div className="w-12 h-12 rounded-md bg-warning-100"></div>
                <div className="w-12 h-12 rounded-md bg-warning-200"></div>
                <div className="w-12 h-12 rounded-md bg-warning-300"></div>
                <div className="w-12 h-12 rounded-md bg-warning-400"></div>
                <div className="w-12 h-12 rounded-md bg-warning-500"></div>
                <div className="w-12 h-12 rounded-md bg-warning-600"></div>
                <div className="w-12 h-12 rounded-md bg-warning-700"></div>
                <div className="w-12 h-12 rounded-md bg-warning-800"></div>
                <div className="w-12 h-12 rounded-md bg-warning-900"></div>
              </div>
              <div className="bg-warning-50 text-warning-900 p-4 rounded-lg border-l-4 border-warning-500">
                <p className="font-medium">Warning Alert</p>
                <p className="text-sm mt-1">
                  This is an example of a warning alert using the warning color
                  palette.
                </p>
              </div>
            </div>

            {/* Info Colors */}
            <div>
              <Typography variant="h6" className="text-info-700 mb-4">
                Info Color Shades
              </Typography>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="w-12 h-12 rounded-md bg-info-50"></div>
                <div className="w-12 h-12 rounded-md bg-info-100"></div>
                <div className="w-12 h-12 rounded-md bg-info-200"></div>
                <div className="w-12 h-12 rounded-md bg-info-300"></div>
                <div className="w-12 h-12 rounded-md bg-info-400"></div>
                <div className="w-12 h-12 rounded-md bg-info-500"></div>
                <div className="w-12 h-12 rounded-md bg-info-600"></div>
                <div className="w-12 h-12 rounded-md bg-info-700"></div>
                <div className="w-12 h-12 rounded-md bg-info-800"></div>
                <div className="w-12 h-12 rounded-md bg-info-900"></div>
              </div>
              <div className="bg-info-50 text-info-900 p-4 rounded-lg border-l-4 border-info-500">
                <p className="font-medium">Info Alert</p>
                <p className="text-sm mt-1">
                  This is an example of an info alert using the info color
                  palette.
                </p>
              </div>
            </div>

            {/* Success Colors */}
            <div>
              <Typography variant="h6" className="text-success-700 mb-4">
                Success Color Shades
              </Typography>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="w-12 h-12 rounded-md bg-success-50"></div>
                <div className="w-12 h-12 rounded-md bg-success-100"></div>
                <div className="w-12 h-12 rounded-md bg-success-200"></div>
                <div className="w-12 h-12 rounded-md bg-success-300"></div>
                <div className="w-12 h-12 rounded-md bg-success-400"></div>
                <div className="w-12 h-12 rounded-md bg-success-500"></div>
                <div className="w-12 h-12 rounded-md bg-success-600"></div>
                <div className="w-12 h-12 rounded-md bg-success-700"></div>
                <div className="w-12 h-12 rounded-md bg-success-800"></div>
                <div className="w-12 h-12 rounded-md bg-success-900"></div>
              </div>
              <div className="bg-success-50 text-success-900 p-4 rounded-lg border-l-4 border-success-500">
                <p className="font-medium">Success Alert</p>
                <p className="text-sm mt-1">
                  This is an example of a success alert using the success color
                  palette.
                </p>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  )
}
