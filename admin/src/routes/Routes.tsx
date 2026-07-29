import { accountInfo } from '@/context/global'
import { useSignals } from '@preact/signals-react/runtime'
import PrivateRoutes from './PrivateRoutes.routes'
import PublicRoutes from './PublicRoutes.routes'

function Routes() {
  useSignals()
  const authenticated = Boolean(accountInfo.value?.token)
  return authenticated ? <PrivateRoutes /> : <PublicRoutes />
}

export default Routes
