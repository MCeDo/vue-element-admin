<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('帐号')" v-model="listQuery.username" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" placeholder="管理员" @change="handleFilter">
        <el-option v-for="item in roleOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column v-if="false" :label="$t('用户ID')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('帐号')" min-width="150px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.username }}</span>
          <!--<el-tag>{{ scope.row.username | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.type==2" :label="$t('用户昵称')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.type==2" :label="$t('所属学校')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.school }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('角色')" width="110px" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.role }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('邮箱')" width="210px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.type==2" :label="$t('真实姓名')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.actualName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.type==2" :label="$t('支付宝')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alipay }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.status')" class-name="status-col" width="100">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['admin']" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <pan-thumb :image="temp.avatar"/>
        <div>
          <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">更换头像
          </el-button>
        </div>
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          url="https://httpbin.org/post"
          lang-type="en"
          @close="close"
          @crop-upload-success="cropSuccess"/>
        <!--<el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.createdTime" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>-->
        <el-form-item :label="$t('帐号')" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item :label="$t('用户名')" prop="nickname">
          <el-input v-model="temp.nickname"/>
        </el-form-item>
        <el-form-item v-if="listQuery.type==2" :label="$t('所属学校')" prop="school">
          <el-input v-model="temp.school"/>
        </el-form-item>
        <el-form-item v-if="listQuery.type==2" :label="$t('支付宝')" prop="school">
          <el-input v-model="temp.alipay"/>
        </el-form-item>
        <!--<el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>-->
        <el-form-item v-if="dialogStatus=='create'" :label="$t('角色')">
          <el-select v-model="temp.roleId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('真是姓名')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.actualName" placeholder="Please input"/>
        </el-form-item>
        <el-form-item :label="$t('邮箱')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.email" placeholder="Please input"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" :label="$t('密码')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.password" placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle, deleteUser } from '@/api/article'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UserManager',
  components: { Pagination, PanThumb, ImageCropper },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        username: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      roleOptions: [{ label: '管理员', key: '1' }, { label: '普通用户', key: '2' }],
      statusOptions: ['published', 'draft', 'deleted'],
      // roleOptions: ['超级管理员', '管理员'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        // timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      // if (this.listQuery.type === undefined) {
      //   this.listQuery.type = 1
      // }
      fetchList(this.listQuery).then(response => {
        const data = response.data.data
        this.list = data.records
        this.total = Number(data.total)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.list = this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      deleteUser(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        console.log(this.listQuery)
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style scoped>
  .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>

