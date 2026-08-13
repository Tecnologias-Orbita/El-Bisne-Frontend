import { env, LOCAL_DEVELOPMENT } from "@/config/env"
import { localApiResolver } from "./local-api-resolver"

type FetchFn = typeof fetch

export const rfetch: FetchFn = (env.nodeEnv as string) === LOCAL_DEVELOPMENT ? fetch : localApiResolver as FetchFn